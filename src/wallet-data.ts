import { getApplication } from "./boot";
import { loadConfig } from "./loader";
import { makeIdentityFactories } from "./builder";
import { generateMnemonic } from "bip39";

const main = async () => {
    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    const app = await getApplication(loadConfig());

    const { publicKeyFactory, privateKeyFactory, addressFactory } = makeIdentityFactories(app);

    console.log("Mnemonic: ", mnemonic);
    console.log("Public Key: ", await publicKeyFactory.fromMnemonic(mnemonic));
    console.log("Private Key: ", await privateKeyFactory.fromMnemonic(mnemonic));
    console.log("Address: ", await addressFactory.fromMnemonic(mnemonic));
};

main();
