import { ContractData, Config } from "./types.js";
import * as Builder from "./builder.js";

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
        const viewParameters = await Builder.makeEvmView(this.config, this.contractData, viewIndex);

        console.log(`View parameters: ${JSON.stringify(viewParameters)}`);
    }

    #logContract() {
        console.log("-".repeat(46));
        console.log(`Contract: ${this.name}`);
        console.log(`Id: ${this.contractData.contractId}`);
        console.log("-".repeat(46));
    }
}
