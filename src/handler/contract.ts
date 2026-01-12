import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";
import { getContractAddress } from "viem";

import {
    ContractData,
    ContractHandler as IContractHandler,
    ContractBuilder,
    ViewBuilder,
    Flags,
    JSONRPCResultSuccess,
    JSONRPCResultError,
} from "../types.js";
import { AppIdentifiers } from "../identifiers.js";
import { BaseHandler } from "./base.js";
import { Transaction } from "@mainsail/contracts/distribution/contracts/crypto/transactions.js";

@injectable()
export class ContractHandler extends BaseHandler implements IContractHandler {
    @inject(AppIdentifiers.ContractBuilder)
    private contractBuilder!: ContractBuilder;

    @inject(AppIdentifiers.ViewBuilder)
    private viewBuilder!: ViewBuilder;

    private contractData!: ContractData;
    private transactionIndex = 0;

    public init(contractData: ContractData, flags: Flags): ContractHandler {
        this.contractData = contractData;
        this.flags = flags;
        return this;
    }

    public list(): void {
        this.#logContract();
        // Deploys:
        this.logger.header("Deploys:");
        this.logger.log(`0 - Deploy`);

        // Transactions:
        this.logger.header("Transactions:");
        let i = 1;
        for (let transaction of this.contractData.transactions) {
            this.logger.log(`${i++} - ${transaction.functionName}`);
        }

        // Views:
        this.logger.header("Views:");

        for (let view of this.contractData.views) {
            this.logger.log(`${i++} - ${view.functionName}`);
        }
    }

    public async interact(transactionIndex: number, args?: any, amount?: string): Promise<string | void> {
        this.transactionIndex = transactionIndex;

        if (this.transactionIndex === 0) {
            return await this.#deploy();
        }

        if (this.transactionIndex - 1 < this.contractData.transactions.length) {
            return await this.#transaction(args, amount);
        } else if (this.transactionIndex - 1 < this.contractData.transactions.length + this.contractData.views.length) {
            await this.#view();
        } else {
            throw new Error("Invalid index");
        }
    }

    async #deploy(): Promise<void> {
        this.#logContract();

        const transaction = await this.contractBuilder.makeDeploy(this.contractData);
        this.handle(transaction);
    }

    async #transaction(args?: any, amount?: string): Promise<void> {
        this.#logContract();

        const transaction = await this.contractBuilder.makeCall(this.contractData, this.transactionIndex, args, amount);
        this.handle(transaction);
    }

    protected async simulateSuccess(transaction: Transaction, response: JSONRPCResultSuccess<string>): Promise<void> {
        this.viewBuilder.decodeViewResult(this.contractData, this.transactionIndex, response.result);
    }

    protected async simulateError(response: JSONRPCResultError): Promise<void> {
        this.viewBuilder.decodeViewError(this.contractData, response.data);
    }

    async #view(): Promise<void> {
        this.#logContract();
        const view = await this.viewBuilder.makeView(this.contractData, this.transactionIndex);

        this.logger.line();
        this.logger.log("Calling view...");
        this.logger.logKV("View data", JSON.stringify(view, null, 2));

        const response = await this.client.ethCall(view);

        if (!response.success) {
            this.logger.line();
            this.logger.log(`View call failed: ${response.message}`);
            this.viewBuilder.decodeViewError(this.contractData, response.data!);
            return;
        }

        this.viewBuilder.decodeViewResult(this.contractData, this.transactionIndex, response.result);
    }

    protected logSend(transaction: Contracts.Crypto.Transaction): void {
        this.logger.line();

        if (this.transactionIndex === 0) {
            this.#logContractSend(transaction);
        } else {
            this.#logTransactionSend(transaction);
        }
    }

    #logContractSend(transaction: Contracts.Crypto.Transaction): void {
        this.logger.logKV("Deployment sent", `0x${transaction.hash}`);
        this.logger.logKV(
            "Contract address",
            getContractAddress({
                from: transaction.data.from as `0x${string}`,
                nonce: transaction.data.nonce.toBigInt(),
            }),
        );
    }

    #logTransactionSend(transaction: Contracts.Crypto.Transaction): void {
        this.logger.logKV("Transaction sent", `0x${transaction.hash}`);
    }

    #logContract() {
        this.logger.line();
        this.logger.logKV("Contract", this.contractData.name);
        this.logger.logKV("Id", this.contractData.contractId);
        this.logger.line();
    }
}
