import { ContractData, Config } from "./types.js";
import * as Builder from "./builder.js";
import * as Client from "./client.js";

export class Contract {
    constructor(
        private config: Config,
        private contractData: ContractData,
    ) {}

    async list() {
        this.#logContract();
        console.log("Transactions:");
        this.#logLine();

        let i = 0;
        for (let transaction of this.contractData.transactions) {
            console.log(`${i++} - ${transaction.functionName}`);
        }

        this.#logLine();
        console.log("Views:");
        this.#logLine();

        for (let view of this.contractData.views) {
            console.log(`${i++} - ${view.functionName}`);
        }
    }

    async interact(transactionIndex: number, args?: any, amount?: string) {
        if (transactionIndex < this.contractData.transactions.length) {
            await this.#transaction(transactionIndex, args, amount);
        } else if (transactionIndex < this.contractData.transactions.length + this.contractData.views.length) {
            await this.#view(transactionIndex - this.contractData.transactions.length);
        } else {
            throw new Error("Invalid index");
        }
    }

    async #transaction(transactionIndex: number, args?: any, amount?: string) {
        this.#logContract();
        const transaction = await Builder.makeEvmCall(this.config, this.contractData, transactionIndex, args, amount);
        this.#logLine();
        console.log("Transaction sent: ", `0x${transaction.hash}`);
        await Client.postTransaction(this.config.cli.peer, transaction.serialized.toString("hex"));
        this.#logLine();
    }

    async #view(viewIndex: number) {
        this.#logContract();
        const view = await Builder.makeEvmView(this.config, this.contractData, viewIndex);
        const result = await Client.postEthView(this.config.cli.peer, view);
        this.#logLine();
        Builder.decodeEvmViewResult(this.config, this.contractData, viewIndex, result);
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
