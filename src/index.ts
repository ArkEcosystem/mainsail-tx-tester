import * as Builder from "./builder.js";
import * as Client from "./client.js";
import * as Loader from "./loader.js";
import { Contract } from "./contract.js";

import { Config, ContractData } from "./types.js";
import { Contracts } from "@mainsail/contracts";

const main = async () => {
    if (process.argv.length < 3) {
        help();
        return;
    }

    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    // const args = process.argv.slice(2);

    // let tx: Contracts.Crypto.Transaction;
    // let txType: number;

    // "transfer" "abc" "1" -- used by faucet
    // if (args.length >= 3) {
    //     const action = args[0];
    //     const recipients = args[1].split(","); // comma-separated
    //     const amount = args[2];
    //     const functionIndex = args[3] !== undefined ? +args[3] : 0;

    //     // node dist/index.js transfer "recipients" "amount"
    //     if (!["transfer", "contract"].includes(action) || !recipients || !recipients.length || !amount) {
    //         throw new Error("action must be 'transfer | contract' followed by the recipients and amount");
    //     }

    //     if (action === "contract") {
    //         txType = 10;
    //         tx = await Builder.makeEvmCall(config, functionIndex, [
    //             functionIndex === 0 ? recipients[0] : recipients,
    //             functionIndex === 0 ? amount : new Array(recipients.length).fill(amount),
    //         ]);
    //     } else {
    //         // if (recipients.length === 1) {
    //         txType = 1;
    //         tx = await Builder.makeTransfer({
    //             ...config,
    //             cli: {
    //                 ...config.cli,
    //                 transfer: {
    //                     ...config.cli.transfer,
    //                     amount,
    //                     recipientId: recipients[0],
    //                 },
    //             },
    //         });
    //     }
    // } else {
    //     txType = parseInt(process.argv[2]);
    //     const functionIndex = parseInt(process.argv[3]) || 0;

    //     if (txType === 11) {
    //         const result = await Client.postEthView(peer, await Builder.makeEvmView(config, functionIndex));

    //         Builder.decodeEvmViewResult(config, functionIndex, result);

    //         return;
    //     }

    //     tx = await makeTx(txType, config, functionIndex);
    // }

    // try {
    //     const result = await Client.postTransaction(peer, tx.serialized.toString("hex"));
    //     console.log(`>> sent ${transactions[txType]} ${tx.id} to ${peer.apiTxPoolUrl}`);

    //     console.log(result);
    // } catch (ex) {
    //     console.log(ex.message);
    //     console.log(`>> failed to send tx ${tx.id} to ${peer.ip}`);
    // }

    const txType = parseInt(process.argv[2]);

    switch (txType) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            await handleContract(config, "Consensus", config.cli.contracts.consensus);
            break;
        case 4:
            await handleContract(config, "Usernames", config.cli.contracts.usernames);
            break;
        default:
            help();
            break;
    }
};

const transactions = {
    1: "Transfer",
    2: "Deploy",
    3: "Consensus",
    4: "Usernames",
};

const help = () => {
    console.log("Please provide TX number in arguments:");
    for (let key in transactions) {
        console.log(`${key} - ${transactions[key]}`);
    }
};

const handleContract = async (config: Config, name: string, contractData: ContractData) => {
    const txIndex = process.argv.length > 3 ? parseInt(process.argv[3]) : undefined;

    const contract = new Contract(config, name, contractData);
    if (txIndex === undefined) {
        contract.list();
    } else {
        await contract.interact(txIndex);
    }
};

// @ts-ignore
const makeTx = async (
    txType: number,
    config: Config,
    functionIndex: number = 0,
): Promise<Contracts.Crypto.Transaction> => {
    switch (txType) {
        case 1:
            return await Builder.makeTransfer(config);
        case 9:
            return await Builder.makeEvmDeploy(config);
        default:
            throw new Error("Invalid TX type");
    }
};

main();
