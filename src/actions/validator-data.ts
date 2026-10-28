import { generateMnemonic } from "bip39";
import { makeApplication } from "../boot.js";
import { getArgsAndFlags, hasFlag } from "../utils.js";
import { makeIdentityFactories } from "./utils.js";

const main = async () => {
    const { args, flags } = getArgsAndFlags();
    const mnemonics =
        args.length === 1 ? [args[0]] : Array.from({ length: Number(flags.count ?? 1) }, () => generateMnemonic(256));

    if (hasFlag(flags, "json")) {
        console.log(JSON.stringify({ secrets: mnemonics }, null, 4));
        return;
    }

    const app = await makeApplication();

    const { consensusPrivateKeyFactory, consensusPublicKeyFactory } = makeIdentityFactories(app);

    for (const mnemonic of mnemonics) {
        console.log("Mnemonic: ", mnemonic);
        console.log();

        console.log("Validator Public Key: ", await consensusPublicKeyFactory.fromMnemonic(mnemonic));
        console.log("Validator Private Key: ", await consensusPrivateKeyFactory.fromMnemonic(mnemonic));
        console.log();
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
