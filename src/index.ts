import * as Builder from "./builder.js";
import * as Client from "./client.js";
import * as Loader from "./loader.js";

import { Config } from "./types.js";
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

    const args = process.argv.slice(2);

    let tx: Contracts.Crypto.Transaction;
    let txType: number;

    // "transfer" "abc" "1" -- used by faucet
    if (args.length === 3) {
        const action = args[0];
        const recipients = args[1].split(","); // comma-separated
        const amount = args[2];

        // node dist/index.js transfer "recipients" "amount"
        if (action !== "transfer" || !recipients || !recipients.length || !amount) {
            throw new Error("action must be 'transfer' followed by the recipients and amount");
        }

        if (recipients.length === 1) {
            txType = 1;
            tx = await Builder.makeTransfer({
                ...config,
                cli: {
                    ...config.cli,
                    transfer: {
                        ...config.cli.transfer,
                        amount,
                        recipientId: recipients[0],
                    },
                },
            });
        } else {
            txType = 5;
            tx = await Builder.makeMultiPayment({
                ...config,
                cli: {
                    ...config.cli,
                    multiPayment: {
                        ...config.cli.multiPayment,
                        payments: recipients.map((recipientId) => ({
                            amount,
                            recipientId,
                        })),
                    },
                },
            });
        }
    } else {
        txType = parseInt(process.argv[2]);
        const functionIndex = parseInt(process.argv[3]) || 0;

        if (txType === 11) {
            const result = await Client.postEthView(peer, await Builder.makeEvmView(config, functionIndex));

            Builder.decodeEvmViewResult(config, functionIndex, result.result);

            return;
        }

        tx = await makeTx(txType, config, functionIndex);
    }

    try {
        const result = await Client.postTransaction(peer, tx.serialized.toString("hex"));
        console.log(`>> sent ${transactions[txType]} ${tx.id} to ${peer.apiTxPoolUrl}`);

        console.log(result);
    } catch (ex) {
        console.log(ex.message);
        console.log(`>> failed to send tx ${tx.id} to ${peer.ip}`);
    }
};

const transactions = {
    1: "Transfer",
    2: "Vote",
    3: "UsernameRegistration",
    4: "UsernameResignation",
    5: "MultiPayment",
    6: "ValidatorRegistration",
    7: "ValidatorResignation",
    8: "MultiSignatureRegistration",
    9: "EvmDeploy",
    10: "EvmCall",
    11: "EvmView",
};

const help = () => {
    console.log("Please provide TX number in arguments:");
    for (let key in transactions) {
        console.log(`${key} - ${transactions[key]}`);
    }
};

const makeTx = async (
    txType: number,
    config: Config,
    functionIndex: number = 0,
): Promise<Contracts.Crypto.Transaction> => {
    switch (txType) {
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
        case 8:
            return await Builder.makeMultisignatureRegistration(config);
        case 9:
            return await Builder.makeEvmDeploy(config);
        case 10:
            return await Builder.makeEvmCall(config, functionIndex);
        default:
            throw new Error("Invalid TX type");
    }
};

main();
