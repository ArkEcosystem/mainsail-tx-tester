import { generateMnemonic } from "bip39";
import { getApplication } from "./boot.js";
import { loadConfig } from "./loader.js";
import { makeIdentityFactories } from "./builder.js";

const main = async () => {
    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    const app = await getApplication(loadConfig());

    const { consensusPrivateKeyFactory, consensusPublicKeyFactory } = makeIdentityFactories(app);

    console.log("Validator Public Key: ", await consensusPublicKeyFactory.fromMnemonic(mnemonic));
    console.log("Validator Private Key: ", await consensusPrivateKeyFactory.fromMnemonic(mnemonic));
};

main();
