import { makeApplication } from "../boot.js";
import { makeIdentityFactories } from "./utils.js";
import { generateMnemonic } from "bip39";

const main = async () => {
    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    const app = await makeApplication();

    const {
        publicKeyFactory,
        privateKeyFactory,
        addressFactory,
        consensusPrivateKeyFactory,
        consensusPublicKeyFactory,
        wifFactory,
    } = makeIdentityFactories(app);

    console.log("Mnemonic: ", mnemonic);
    console.log();

    // try/catch here as consensus factories cannot handle non-standard mnemonics
    try {
        console.log("Validator Public Key: ", await consensusPublicKeyFactory.fromMnemonic(mnemonic));
        console.log("Validator Private Key: ", await consensusPrivateKeyFactory.fromMnemonic(mnemonic));
        console.log();
    } catch (error) {
        //
    }

    console.log("Public Key: ", await publicKeyFactory.fromMnemonic(mnemonic));
    console.log("Private Key: ", await privateKeyFactory.fromMnemonic(mnemonic));
    console.log("Address: ", await addressFactory.fromMnemonic(mnemonic));
    console.log("WIF: ", await wifFactory.fromMnemonic(mnemonic));
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
