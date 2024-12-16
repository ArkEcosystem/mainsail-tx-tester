import * as Builder from "./builder.js";
import * as Client from "./client.js";
import * as Loader from "./loader.js";
import { Contract } from "./contract.js";

import { Config, ContractData } from "./types.js";
import { getContractAddress } from "viem";

const main = async () => {
    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    if (process.argv.length < 3) {
        help(config);
        return;
    }

    const txType = parseInt(process.argv[2]);

    switch (txType) {
        case 1: {
            const recipient = process.argv.length > 3 ? process.argv[3] : undefined;
            const amount = process.argv.length > 4 ? process.argv[4] : undefined;

            const tx = await await Builder.makeTransfer(config, recipient, amount);
            const result = await Client.postTransaction(peer, tx.serialized.toString("hex"));
            console.log(`Sent transfer with id: ${tx.id} \n`);

            console.log(result);

            break;
        }
        case 2: {
            const tx = await Builder.makeEvmDeploy(config);
            const result = await Client.postTransaction(peer, tx.serialized.toString("hex"));
            console.log(`Sent deploy with id: ${tx.id}`);
            console.log(
                `Deployed contract address: ${getContractAddress({
                    from: tx.data.senderAddress as any,
                    nonce: tx.data.nonce.toBigInt(),
                })}\n`,
            );

            console.log(result);
            break;
        }
        default: {
            const contracts: ContractData[] = Object.values(config.cli.contracts);

            if (txType < contracts.length + 3) {
                await handleContract(config, contracts[txType - 3]);
            } else {
                help(config);
            }
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

const handleContract = async (config: Config, contractData: ContractData) => {
    const txIndex = process.argv.length > 3 ? parseInt(process.argv[3]) : undefined;
    const args = process.argv.length > 4 ? JSON.parse(process.argv[4]) : undefined;
    const amount = process.argv.length > 5 ? process.argv[5] : undefined;

    const contract = new Contract(config, contractData);
    if (txIndex === undefined) {
        contract.list();
    } else {
        await contract.interact(txIndex, args, amount);
    }
};

main();
