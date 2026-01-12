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
        if (transactionIndex === 0) {
            return await this.#deploy();
        }

        if (transactionIndex - 1 < this.contractData.transactions.length) {
            return await this.#transaction(transactionIndex, args, amount);
        } else if (transactionIndex - 1 < this.contractData.transactions.length + this.contractData.views.length) {
            await this.#view(transactionIndex);
        } else {
            throw new Error("Invalid index");
        }
    }

    async #deploy(): Promise<string> {
        this.#logContract();
        const transaction = await this.contractBuilder.makeDeploy(this.contractData);
        // this.#logTransaction(transaction);

        // await this.#gasEstimate(transaction);
        // await this.#simulate(transaction, 0);

        // this.#logDeploy(transaction);

        // await this.client.postTransaction(transaction.serialized.toString("hex"));
        // await this.#waitForOneBlock();
        // await this.#logTransactionReceipt(transaction);

        return transaction.hash;
    }

    async #transaction(transactionIndex: number, args?: any, amount?: string): Promise<string> {
        this.#logContract();
        const transaction = await this.contractBuilder.makeCall(this.contractData, transactionIndex, args, amount);

        this.handle(transaction, transactionIndex);

        return transaction.hash;
    }

    protected async simulateSuccess(
        transaction: Transaction,
        functionIndex: number,
        response: JSONRPCResultSuccess<string>,
    ): Promise<void> {
        this.viewBuilder.decodeViewResult(this.contractData, functionIndex, response.result);
    }

    protected async simulateError(response: JSONRPCResultError): Promise<void> {
        this.viewBuilder.decodeViewError(this.contractData, response.data);
    }

    async #view(functionIndex: number): Promise<void> {
        this.#logContract();
        const view = await this.viewBuilder.makeView(this.contractData, functionIndex);

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

        this.viewBuilder.decodeViewResult(this.contractData, functionIndex, response.result);
    }

    protected logSend(transaction: Contracts.Crypto.Transaction, transactionIndex: number): void {
        this.logger.line();

        if (transactionIndex === 0) {
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
