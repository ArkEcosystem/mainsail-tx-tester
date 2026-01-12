import { generateMnemonic } from "bip39";
import { makeApplication } from "../boot.js";
import { makeIdentityFactories } from "./utils.js";

const main = async () => {
    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    const app = await makeApplication();

    const { consensusPrivateKeyFactory, consensusPublicKeyFactory } = makeIdentityFactories(app);

    console.log("Mnemonic: ", mnemonic);
    console.log();

    console.log("Validator Public Key: ", await consensusPublicKeyFactory.fromMnemonic(mnemonic));
    console.log("Validator Private Key: ", await consensusPrivateKeyFactory.fromMnemonic(mnemonic));
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
