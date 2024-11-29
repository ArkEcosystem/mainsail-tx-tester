import * as Builder from "./builder.js";
import * as Client from "./client.js";
import * as Loader from "./loader.js";
import { Contract } from "./contract.js";

import { Config, ContractData } from "./types.js";

const main = async () => {
    if (process.argv.length < 3) {
        help();
        return;
    }

    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    const txType = parseInt(process.argv[2]);

    switch (txType) {
        case 1: {
            const recipient = process.argv.length > 3 ? process.argv[3] : undefined;
            const amount = process.argv.length > 4 ? process.argv[4] : undefined;

            const tx = await await Builder.makeTransfer(config, recipient, amount);
            const result = await Client.postTransaction(peer, tx.serialized.toString("hex"));
            console.log(`>> sent Transfer ${tx.id} to ${peer.apiTxPoolUrl}`);

            console.log(result);

            break;
        }
        case 2: {
            const tx = await Builder.makeEvmDeploy(config);
            const result = await Client.postTransaction(peer, tx.serialized.toString("hex"));
            console.log(`>> sent Deploy ${tx.id} to ${peer.apiTxPoolUrl}`);

            console.log(result);
            break;
        }
        case 3:
            await handleContract(config, "Consensus", config.cli.contracts.consensus);
            break;
        case 4:
            await handleContract(config, "MultiPayment", config.cli.contracts.multiPayment);
            break;
        case 5:
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
    4: "MultiPayment",
    5: "Usernames",
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

main();
