import * as Loader from "./loader";
import * as Client from "./client";
import * as Builder from "./builder";
import { Config } from "./types";
import { Contracts } from "@mainsail/contracts";


const main = async () => {
    if(process.argv.length < 3) {
        help();
        return;
    }

    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    const tx = await makeTx(parseInt(process.argv[2]), config);

    await Client.postTransaction(peer, tx.serialized.toString("hex"));
    console.log(`>> sent tx ${tx.id} to ${peer.ip}`);
};

const help = () => {
    console.log("Please provide TX number in arguments:")
    console.log("1 - Transfer")
    console.log("2 - Vote")
    console.log("3 - UsernameRegistration")
    console.log("4 - UsernameResignation")
    console.log("5 - MultiPayment")
    console.log("5 - ValidatorRegistration")
    console.log("6 - ValidatorResignation")
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
