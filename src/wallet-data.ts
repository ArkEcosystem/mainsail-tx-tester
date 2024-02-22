import { getApplication } from "./boot";
import { loadConfig } from "./loader";
import { makeIdentityFactories } from "./builder";

const main = async () => {
    if (process.argv.length !== 3) {
        console.log("Please provide a wallet mnemonic as first argument");
        return;
    }

    const mnemonic = process.argv[2];

    console.log("Mnemonic: ", mnemonic);

    const app = await getApplication(loadConfig());

    const { publicKeyFactory, addressFactory } = makeIdentityFactories(app);

    console.log("Public Key: ", await publicKeyFactory.fromMnemonic(mnemonic));
    console.log("Address: ", await addressFactory.fromMnemonic(mnemonic));
};

main();
