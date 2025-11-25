import { Config, ContractData, Client, TransferBuilder, ContractFactory } from "./types.js";
import { makeApplication } from "./boot.js";
import { AppIdentifiers } from "./identifiers.js";
import { getArgs } from "./utils.js";

import { Contracts } from "@mainsail/contracts";

export const main = async (customArgs?: string[]) => {
    const app = await makeApplication();
    const config = app.get<Config>(AppIdentifiers.Config);

    const { args, flags } = getArgs(customArgs);

    if (args.length < 1) {
        help(config);
        return;
    }

    if (flags["nonce"]) {
        app.rebind(AppIdentifiers.WalletNonce).toConstantValue(parseInt(flags["nonce"]));
    }

    const txType = parseInt(args[0]);

    const contracts: ContractData[] = Object.values(config.contracts);

    if (txType >= contracts.length + 3) {
        help(config);
        return;
    }

    const client = app.get<Client>(AppIdentifiers.Client);

    switch (txType) {
        case 1: {
            const recipient = args.length > 1 ? args[1] : undefined;
            const amount = args.length > 2 ? args[2] : undefined;

            const tx = await app
                .get<TransferBuilder>(AppIdentifiers.TransferBuilder)
                .makeTransfer(config, recipient, amount);
            await client.postTransaction(tx.serialized.toString("hex"));
            console.log(`Sent transfer with transaction hash: 0x${tx.hash} \n`);

            // await waitForOneBlock(peer);
            // await logTransactionResult(peer, tx.hash);

            break;
        }
        default: {
            await handleContract(app, args, contracts[txType - 2]);
            break;
        }
    }
};

const help = (config: Config) => {
    console.log("Please provide TX number in arguments:");

    console.log("1 - Transfer");

    const contracts: ContractData[] = Object.values(config.contracts);
    let index = 2;
    for (let contract of contracts) {
        console.log(`${index++} - ${contract.name}`);
    }
};

const handleContract = async (app: Contracts.Kernel.Application, args: string[], contractData: ContractData) => {
    const txIndex = args.length > 1 ? parseInt(args[1]) : undefined;
    const txArgs = args.length > 2 ? JSON.parse(args[2]) : undefined;
    const amount = args.length > 3 ? args[3] : undefined;

    const contract = app.get<ContractFactory>(AppIdentifiers.ContractFactory)(contractData);
    if (txIndex === undefined) {
        contract.list();
    } else {
        const hash = await contract.interact(txIndex, txArgs, amount);

        if (hash === undefined) {
            return;
        }

        // await waitForOneBlock(peer);
        // await logTransactionResult(peer, hash);
    }
};

// const waitForOneBlock = async (peer: string): Promise<void> => {
//     return;

//     const timeout = 2000; // 2 seconds

//     const startHeight = await Client.getHeight(peer);
//     console.log("Waiting for next block...");
//     await sleep(timeout);

//     while (startHeight + 1 >= (await Client.getHeight(peer))) {
//         console.log(".");
//         await sleep(timeout);
//     }
// };

// const logTransactionResult = async (peer: string, txHash: string): Promise<void> => {
//     console.log(`Fetching transaction receipt for hash: 0x${txHash}`);

//     const receipt = await Client.getReceipt(peer, txHash);

//     if (receipt === null) {
//         console.log("Transaction was not forged.");
//         return;
//     }

//     if (receipt.status === "0x0") {
//         console.log("Transaction failed:");
//     } else {
//         console.log("Transaction succeeded:");
//     }

//     console.log(receipt);
// };

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
