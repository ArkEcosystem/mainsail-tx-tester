import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";

import { ContractData, Client, Contract as IContract, ContractBuilder, ViewBuilder } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";

@injectable()
export class Contract implements IContract {
    @inject(AppIdentifiers.Client)
    private client!: Client;

    @inject(AppIdentifiers.ContractBuilder)
    private contractBuilder!: ContractBuilder;

    @inject(AppIdentifiers.ViewBuilder)
    private viewBuilder!: ViewBuilder;

    private contractData!: ContractData;

    public init(contractData: ContractData): Contract {
        this.contractData = contractData;
        return this;
    }

    list(): void {
        this.#logContract();
        // Deploys:
        console.log("Deploys:");
        this.#logLine();
        console.log(`0 - Deploy`);
        this.#logLine();

        // Transactions:
        console.log("Transactions:");
        this.#logLine();
        let i = 1;
        for (let transaction of this.contractData.transactions) {
            console.log(`${i++} - ${transaction.functionName}`);
        }
        this.#logLine();

        // Views:
        console.log("Views:");
        this.#logLine();

        for (let view of this.contractData.views) {
            console.log(`${i++} - ${view.functionName}`);
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
        this.#logLine();

        this.#logLine();
        console.log("Deployment sent: ", `0x${transaction.hash}`);
        await this.client.postTransaction(transaction.serialized.toString("hex"));
        this.#logLine();

        return transaction.hash;
    }

    async #transaction(transactionIndex: number, args?: any, amount?: string): Promise<string> {
        this.#logContract();
        const transaction = await this.contractBuilder.makeCall(this.contractData, transactionIndex, args, amount);
        this.#logLine();

        // await this.#simulate(this.config.cli.peer, transaction);

        this.#logLine();
        console.log("Transaction sent: ", `0x${transaction.hash}`);
        await this.client.postTransaction(transaction.serialized.toString("hex"));
        this.#logLine();

        return transaction.hash;
    }

    // @ts-ignore
    #simulate = async (transaction: Contracts.Crypto.Transaction): Promise<void> => {
        console.log("Simulating transaction...");
        const result = await this.client.ethCall({
            from: transaction.data.from,
            to: transaction.data.to!, // TODO: Support to
            data: `0x${transaction.serialized.toString("hex")}`,
            // gas: transaction.data.gasLimit?.toString(),
            // gasPrice: transaction.data.gasPrice?.toString(),
            // value: transaction.data.value?.toString(),
        });

        console.log("Simulation result:");
        console.log(result);
    };

    async #view(viewIndex: number): Promise<void> {
        this.#logContract();
        const view = await this.viewBuilder.makeView(this.contractData, viewIndex);
        const result = await this.client.ethCall(view);
        this.#logLine();
        this.viewBuilder.decodeViewResult(this.contractData, viewIndex, result);
        this.#logLine();
    }

    #logContract() {
        this.#logLine();
        console.log(`Contract: ${this.contractData.name}`);
        console.log(`Id: ${this.contractData.contractId}`);
        this.#logLine();
    }

    #logLine() {
        console.log("-".repeat(46));
    }
}
