import * as Builder from "./builder.js";
import * as Client from "./client.js";
import * as Loader from "./loader.js";
import { Contract } from "./contract.js";

import { Config, ContractData } from "./types.js";
import { getContractAddress } from "viem";
import { makeApplication } from "./boot.js";
import { AppIdentifiers } from "./identifiers.js";
import { getArgs } from "./utils.js";

export const main = async (customArgs?: string[]) => {
    const config = Loader.loadConfig();
    const app = await makeApplication(config);

    const peer = config.cli.peer;

    const { args, flags } = getArgs(customArgs);

    if (args.length < 1) {
        help(config);
        return;
    }

    if (flags["nonce"]) {
        app.rebind(AppIdentifiers.WalletNonce).toConstantValue(parseInt(flags["nonce"]));
    }

    const txType = parseInt(args[0]);

    const contracts: ContractData[] = Object.values(config.cli.contracts);

    if (txType >= contracts.length + 3) {
        help(config);
        return;
    }

    switch (txType) {
        case 1: {
            const recipient = args.length > 1 ? args[1] : undefined;
            const amount = args.length > 2 ? args[2] : undefined;

            const tx = await Builder.makeTransfer(config, recipient, amount);
            await Client.postTransaction(peer, tx.serialized.toString("hex"));
            console.log(`Sent transfer with transaction hash: 0x${tx.hash} \n`);

            break;
        }
        case 2: {
            const tx = await Builder.makeEvmDeploy(config);
            await Client.postTransaction(peer, tx.serialized.toString("hex"));
            console.log(`Sent deploy with transaction hash: 0x${tx.hash}`);
            console.log(
                `Deployed contract address: ${getContractAddress({
                    from: tx.data.from as any,
                    nonce: tx.data.nonce.toBigInt(),
                })}\n`,
            );
            break;
        }
        default: {
            await handleContract(args, config, contracts[txType - 3]);
            break;
        }
    }
};

const help = (config: Config) => {
    console.log("Please provide TX number in arguments:");

    console.log("1 - Transfer");
    console.log("2 - Deploy");

    const contracts: ContractData[] = Object.values(config.cli.contracts);
    let index = 3;
    for (let contract of contracts) {
        console.log(`${index++} - ${contract.name}`);
    }
};

const handleContract = async (args: string[], config: Config, contractData: ContractData) => {
    const txIndex = args.length > 1 ? parseInt(args[1]) : undefined;
    const txArgs = args.length > 2 ? JSON.parse(args[2]) : undefined;
    const amount = args.length > 3 ? args[3] : undefined;

    const contract = new Contract(config, contractData);
    if (txIndex === undefined) {
        contract.list();
    } else {
        await contract.interact(txIndex, txArgs, amount);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
