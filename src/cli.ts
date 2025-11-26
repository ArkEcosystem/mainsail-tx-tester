import { injectable, inject } from "@mainsail/container";
import { Config, Logger, ContractFactory, ContractData, TransactionSender, TransferBuilder, Args } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";
import { getArgs } from "./utils.js";

const PRE_CONTRACT_OFFSET = 1;

@injectable()
export class Cli {
    @inject(AppIdentifiers.Config)
    protected config!: Config;

    @inject(AppIdentifiers.Logger)
    protected logger!: Logger;

    @inject(AppIdentifiers.TransferBuilder)
    protected transferBuilder!: TransferBuilder;

    @inject(AppIdentifiers.TransactionSender)
    protected transactionSender!: TransactionSender;

    @inject(AppIdentifiers.ContractFactory)
    protected contractFactory!: ContractFactory;

    async run() {
        const { args } = getArgs();

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
            await this.handleTransfer(args);
        } else {
            await this.handleContract(args, contracts[txType - PRE_CONTRACT_OFFSET - 1]);
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
    }

    handleTransfer = async (args: Args) => {
        const recipient = args.length > 1 ? args[1] : undefined;
        const amount = args.length > 2 ? args[2] : undefined;

        const tx = await this.transferBuilder.makeTransfer(this.config, recipient, amount);
        await this.transactionSender.sendTransaction(tx);
    };

    handleContract = async (args: Args, contractData: ContractData) => {
        const txIndex = args.length > 1 ? parseInt(args[1]) : undefined;
        const txArgs = args.length > 2 ? JSON.parse(args[2]) : undefined;
        const amount = args.length > 3 ? args[3] : undefined;

        const contract = this.contractFactory(contractData);
        if (txIndex === undefined) {
            contract.list();
        } else {
            await contract.interact(txIndex, txArgs, amount);
        }
    };
}
