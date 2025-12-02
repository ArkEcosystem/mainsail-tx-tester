import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";
import { getContractAddress } from "viem";

import {
    ContractData,
    Client,
    Contract as IContract,
    ContractBuilder,
    ViewBuilder,
    Logger,
    Config,
    Flags,
} from "./types.js";
import { AppIdentifiers } from "./identifiers.js";
import { sleep } from "./utils.js";

@injectable()
export class Contract implements IContract {
    @inject(AppIdentifiers.Logger)
    private logger!: Logger;

    @inject(AppIdentifiers.Config)
    protected config!: Config;

    @inject(AppIdentifiers.Client)
    private client!: Client;

    @inject(AppIdentifiers.ContractBuilder)
    private contractBuilder!: ContractBuilder;

    @inject(AppIdentifiers.ViewBuilder)
    private viewBuilder!: ViewBuilder;

    private contractData!: ContractData;
    // @ts-ignore
    private flags!: Flags;

    public init(contractData: ContractData, flags: Flags): Contract {
        this.contractData = contractData;
        this.flags = flags;
        return this;
    }

    list(): void {
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

    async interact(transactionIndex: number, args?: any, amount?: string): Promise<string | void> {
        if (transactionIndex === 0) {
            return await this.#deploy();
        }

        transactionIndex--; // Adjust for deploy at index 0
        if (transactionIndex < this.contractData.transactions.length) {
            return await this.#transaction(transactionIndex, args, amount);
        } else if (transactionIndex < this.contractData.transactions.length + this.contractData.views.length) {
            await this.#view(transactionIndex - this.contractData.transactions.length);
        } else {
            throw new Error("Invalid index");
        }
    }

    async #deploy(): Promise<string> {
        this.#logContract();
        const transaction = await this.contractBuilder.makeDeploy(this.contractData);

        await this.#gasEstimate(transaction);
        await this.#simulate(transaction);

        this.#logDeploy(transaction);

        await this.client.postTransaction(transaction.serialized.toString("hex"));
        await this.#waitForOneBlock();
        await this.#logTransactionReceipt(transaction);

        return transaction.hash;
    }

    async #transaction(transactionIndex: number, args?: any, amount?: string): Promise<string> {
        this.#logContract();
        const transaction = await this.contractBuilder.makeCall(this.contractData, transactionIndex, args, amount);
        this.logger.line();

        await this.#gasEstimate(transaction);
        await this.#simulate(transaction);

        this.#logTransaction(transaction);
        await this.client.postTransaction(transaction.serialized.toString("hex"));

        await this.#waitForOneBlock();
        await this.#logTransactionReceipt(transaction);

        return transaction.hash;
    }

    // @ts-ignore
    async #gasEstimate(transaction: Contracts.Crypto.Transaction): Promise<void> {
        this.logger.line();
        this.logger.log("Estimating gas...");

        const data = {
            from: transaction.data.from,
            to: transaction.data.to!,
            data: `0x${transaction.data.data}`,
            gas: `0x${transaction.data.gasLimit?.toString(16)}`,
            gasPrice: `0x${transaction.data.gasPrice?.toString(16)}`,
            value: transaction.data.value ? `0x${transaction.data.value.toString(16)}` : undefined,
        };

        this.logger.log("Gas estimation call data:");
        this.logger.log(JSON.stringify(data, null, 2));

        const gasEstimate = await this.client.ethEstimateGas(data);

        this.logger.logKV("Estimated gas", gasEstimate);
    }

    // @ts-ignore
    async #simulate(transaction: Contracts.Crypto.Transaction): Promise<void> {
        this.logger.line();
        this.logger.log("Simulating transaction...");

        const data = {
            from: transaction.data.from,
            to: transaction.data.to!,
            data: `0x${transaction.data.data}`,
            gas: `0x${transaction.data.gasLimit?.toString(16)}`,
            gasPrice: `0x${transaction.data.gasPrice?.toString(16)}`,
            value: transaction.data.value ? `0x${transaction.data.value.toString(16)}` : undefined,
        };

        this.logger.log("Simulation call data:");
        this.logger.log(JSON.stringify(data, null, 2));

        const result = await this.client.ethCall(data);

        this.logger.log("Simulation result:");
        this.logger.log(result);
    }

    // @ts-ignore
    async #waitForOneBlock(): Promise<void> {
        if (!this.config.waitForBlock) {
            return;
        }

        const timeout = 2000; // 2 seconds

        const startHeight = await this.client.getHeight();
        this.logger.line();
        this.logger.log("Waiting for next block...");
        await sleep(timeout);

        while (startHeight + 1 >= (await this.client.getHeight())) {
            this.logger.log(".");
            await sleep(timeout);
        }
    }

    // @ts-ignore
    async #logTransactionReceipt(tx: Contracts.Crypto.Transaction): Promise<void> {
        this.logger.line();
        this.logger.log(`Fetching transaction receipt for hash: 0x${tx.hash}`);

        const receipt = await this.client.getReceipt(tx.hash);

        if (receipt === null) {
            this.logger.log("Transaction was not forged.");
            return;
        }

        if (receipt.status === "0x0") {
            this.logger.log("Transaction failed:");
        } else {
            this.logger.log("Transaction succeeded:");
        }

        this.logger.log(JSON.stringify(receipt, null, 2));
    }

    async #view(viewIndex: number): Promise<void> {
        this.#logContract();
        const view = await this.viewBuilder.makeView(this.contractData, viewIndex);

        this.logger.line();
        this.logger.log("Calling view...");
        this.logger.logKV("View data", JSON.stringify(view, null, 2));

        const result = await this.client.ethCall(view);

        this.logger.line();
        this.viewBuilder.decodeViewResult(this.contractData, viewIndex, result);
        this.logger.line();
    }

    #logDeploy(transaction: Contracts.Crypto.Transaction): void {
        this.logger.line();
        this.logger.logKV("Deployment sent", `0x${transaction.hash}`);
        this.logger.logKV(
            "Contract address",
            getContractAddress({
                from: transaction.data.from as `0x${string}`,
                nonce: transaction.data.nonce.toBigInt(),
            }),
        );
    }

    #logTransaction(transaction: Contracts.Crypto.Transaction): void {
        this.logger.line();
        this.logger.logKV("Transaction sent", `0x${transaction.hash}`);
    }

    #logContract() {
        this.logger.line();
        this.logger.logKV("Contract", this.contractData.name);
        this.logger.logKV("Id", this.contractData.contractId);
        this.logger.line();
    }
}
