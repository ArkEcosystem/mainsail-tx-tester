import { Contracts } from "@mainsail/contracts";
import * as Loader from "./loader";
import * as Client from "./client";
import * as Builder from "./builder";
import { Config } from "./types";

const main = async () => {  
    if(process.argv.length < 3) {
        help();
        return;
    }

    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    const args = process.argv.slice(2);

    let tx: Contracts.Crypto.Transaction;
    let txType: number;

    // "transfer" "abc" "1" -- used by faucet
    if (args.length === 3) {
        const action = args[0];
        const recipientId = args[1];
        const amount = args[2];

        // node dist/index.js transfer "recipientId" "amount"
        if (action !== "transfer" || !recipientId || !amount) {
            throw new Error("action must be 'transfer' followed by the recipient and amount");
        }

        txType = 1;

        tx = await Builder.makeTransfer(
            {
                ...config,
                cli: {
                    ...config.cli,
                    transfer: {
                        ...config.cli.transfer,
                        amount,
                        recipientId,
                    }
                }
            },
        );
    } else {
        txType = parseInt(process.argv[2]);
        tx = await makeTx(txType, config);
    }

    await Client.postTransaction(peer, tx.serialized.toString("hex"));
    console.log(`>> sent ${transactions[txType]} ${tx.id} to ${peer.ip}`);
};

const transactions = {
    1: "Transfer",
    2: "Vote",
    3: "UsernameRegistration",
    4: "UsernameResignation",
    5: "MultiPayment",
    6: "ValidatorRegistration",
    7: "ValidatorResignation"
}

const help = () => {
    console.log("Please provide TX number in arguments:")
    for(let key in transactions) {
        console.log(`${key} - ${transactions[key]}`)
    }
}

const makeTx = async (txType: number, config: Config): Promise<Contracts.Crypto.Transaction> => {
    switch(txType) {
        case 1:
            return await Builder.makeTransfer(config);
        case 2:
            return await Builder.makeVote(config);
        case 3:
            return await Builder.makeUsernameRegistration(config);
        case 4:
            return await Builder.makeUsernameResignation(config);
        case 5:
            return await Builder.makeMultiPayment(config);
        case 6:
            return await Builder.makeValidatorRegistration(config);
        case 7:
            return await Builder.makeValidatorResignation(config);
        default:
            throw new Error("Invalid TX type")
    }
}

main();
