import { getApplication } from "./boot.js";
import { loadConfig } from "./loader.js";
import { makeIdentityFactories } from "./builder.js";
import { generateMnemonic } from "bip39";

const main = async () => {
    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    const app = await getApplication(loadConfig());

    const {
        keyPairFactory,
        signatureFactory,
    } = makeIdentityFactories(app);
    
    const keyPair = (await keyPairFactory.fromMnemonic(mnemonic))
    const signature = await signatureFactory.sign(Buffer.from("Hello World"), Buffer.from(keyPair.privateKey, "hex"));

    console.log("Signature: ", signature);

    console.log();
    console.log("Mnemonic: ", mnemonic);
    console.log();

    console.log("Public Key: ", keyPair.publicKey);
    console.log("Private Key: ", keyPair.privateKey);
};

main();
