import { Contracts } from "@mainsail/contracts";

import { ContractData, Config } from "./types.js";
import * as Builder from "./builder.js";
import { Client } from "./client.js";
import { AppIdentifiers } from "./identifiers.js";

export class Contract {
    constructor(
        private config: Config,
        private contractData: ContractData,
    ) {}

    async list() {
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

    async interact(
        app: Contracts.Kernel.Application,
        transactionIndex: number,
        args?: any,
        amount?: string,
    ): Promise<string | void> {
        if (transactionIndex === 0) {
            return await this.#deploy(app);
        }

        transactionIndex--; // Adjust for deploy at index 0
        if (transactionIndex < this.contractData.transactions.length) {
            return await this.#transaction(app, transactionIndex, args, amount);
        } else if (transactionIndex < this.contractData.transactions.length + this.contractData.views.length) {
            await this.#view(app, transactionIndex - this.contractData.transactions.length);
        } else {
            throw new Error("Invalid index");
        }
    }

    async #deploy(app: Contracts.Kernel.Application): Promise<string> {
        this.#logContract();
        const transaction = await Builder.makeEvmDeploy(this.config, this.contractData);
        this.#logLine();

        this.#logLine();
        console.log("Deployment sent: ", `0x${transaction.hash}`);
        await app
            .get<Client>(AppIdentifiers.Client)
            .postTransaction(this.config.cli.peer, transaction.serialized.toString("hex"));
        this.#logLine();

        return transaction.hash;
    }

    async #transaction(
        app: Contracts.Kernel.Application,
        transactionIndex: number,
        args?: any,
        amount?: string,
    ): Promise<string> {
        this.#logContract();
        const transaction = await Builder.makeEvmCall(this.config, this.contractData, transactionIndex, args, amount);
        this.#logLine();

        // await this.#simulate(this.config.cli.peer, transaction);

        this.#logLine();
        console.log("Transaction sent: ", `0x${transaction.hash}`);
        await app
            .get<Client>(AppIdentifiers.Client)
            .postTransaction(this.config.cli.peer, transaction.serialized.toString("hex"));
        this.#logLine();

        return transaction.hash;
    }

    // @ts-ignore
    #simulate = async (app: Contracts.Kernel.Application, transaction: Contracts.Crypto.Transaction): Promise<void> => {
        console.log("Simulating transaction...");
        const result = await app.get<Client>(AppIdentifiers.Client).ethCall(this.config.cli.peer, {
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

    async #view(app: Contracts.Kernel.Application, viewIndex: number): Promise<void> {
        this.#logContract();
        const view = await Builder.makeEvmView(this.config, this.contractData, viewIndex);
        const result = await app.get<Client>(AppIdentifiers.Client).ethCall(this.config.cli.peer, view);
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
