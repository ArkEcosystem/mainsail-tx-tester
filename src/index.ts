import * as Builder from "./builder.js";
import * as Client from "./client.js";
import * as Loader from "./loader.js";
import { Contract } from "./contract.js";

import { Config, ContractData } from "./types.js";
import { getContractAddress } from "viem";
import { makeApplication } from "./boot.js";

const main = async () => {
    const config = Loader.loadConfig();
    await makeApplication(config);

    const peer = config.cli.peer;

    const args = process.argv.slice(2);

    if (args.length < 1) {
        help(config);
        return;
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

main();
