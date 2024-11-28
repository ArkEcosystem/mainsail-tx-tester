import { ContractData, Config } from "./types.js";
import * as Builder from "./builder.js";
import * as Client from "./client.js";

export class Contract {
    constructor(
        private config: Config,
        private name: string,
        private contractData: ContractData,
    ) {
        console.log("Contract constructor");
    }

    async list() {
        this.#logContract();
        console.log("Views:");

        let i = 0;
        for (let view of this.contractData.views) {
            console.log(`${i++} - ${view.functionName}`);
        }
    }

    async view(viewIndex: number) {
        this.#logContract();
        const view = await Builder.makeEvmView(this.config, this.contractData, viewIndex);
        const result = await Client.postEthView(this.config.cli.peer, view);
        this.#logLine();
        Builder.decodeEvmViewResult(this.config, this.contractData, viewIndex, result);
        this.#logLine();
    }

    #logContract() {
        this.#logLine();
        console.log(`Contract: ${this.name}`);
        console.log(`Id: ${this.contractData.contractId}`);
        this.#logLine();
    }

    #logLine() {
        console.log("-".repeat(46));
    }
}
