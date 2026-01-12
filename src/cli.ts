import { injectable, inject } from "@mainsail/container";
import { Config, Logger, ContractHandlerFactory, ContractData, TransactionHandler, Args, Flags } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";
import { getArgsAndFlags } from "./utils.js";

const PRE_CONTRACT_OFFSET = 1;

@injectable()
export class Cli {
    @inject(AppIdentifiers.Config)
    protected config!: Config;

    @inject(AppIdentifiers.Logger)
    protected logger!: Logger;

    @inject(AppIdentifiers.TransactionHandler)
    protected transactionHandler!: TransactionHandler;

    @inject(AppIdentifiers.ContractHandlerFactory)
    protected contractHandlerFactory!: ContractHandlerFactory;

    async run() {
        const { args, flags } = getArgsAndFlags();

        if (args.length < 1) {
            this.help();
            return;
        }

        const txType = parseInt(args[0]);

        const contracts = Object.values(this.config.contracts);

        if (txType > contracts.length + PRE_CONTRACT_OFFSET || txType < 1) {
            this.help();
            return;
        }

        if (txType === 1) {
            await this.handleTransfer(args, flags);
        } else {
            await this.handleContract(args, flags, contracts[txType - PRE_CONTRACT_OFFSET - 1]);
        }
    }

    help(): void {
        this.logger.log("Please provide TX number in arguments:");
        this.logger.log("1 - Transfer");

        // List contracts
        let index = 2;
        for (let contract of Object.values(this.config.contracts)) {
            this.logger.log(`${index++} - ${contract.name}`);
        }

        this.logger.log("");
        this.logger.log("Flags:");
        this.logger.log("--estimateGas          : Estimate gas for the transaction");
        this.logger.log("--skipSimulate         : Skip transaction simulation");
        this.logger.log("--forceSend            : Always send transaction even if simulation fails");
    }

    handleTransfer = async (args: Args, flags: Flags) => {
        const recipient = args.length > 1 ? args[1] : undefined;
        const amount = args.length > 2 ? args[2] : undefined;

        await this.transactionHandler.sendTransaction(flags, recipient, amount);
    };

    handleContract = async (args: Args, flags: Flags, contractData: ContractData) => {
        const txIndex = args.length > 1 ? parseInt(args[1]) : undefined;
        const txArgs = args.length > 2 ? JSON.parse(args[2]) : undefined;
        const amount = args.length > 3 ? args[3] : undefined;

        const contractHandler = this.contractHandlerFactory(contractData, flags);
        if (txIndex === undefined) {
            contractHandler.list();
        } else {
            await contractHandler.interact(txIndex, txArgs, amount);
        }
    };
}
