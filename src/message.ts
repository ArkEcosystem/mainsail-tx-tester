import { getApplication } from "./boot.js";
import { loadConfig } from "./loader.js";
import { makeIdentityFactories } from "./builder.js";
import { generateMnemonic } from "bip39";

const main = async () => {
    const mnemonic = process.argv.length >= 3 ? process.argv[2] : generateMnemonic(256);
    const message = process.argv.length === 4 ? process.argv[3] : "Hello World";

    const app = await getApplication(loadConfig());

    const {
        privateKeyFactory,
        publicKeyFactory,
        signatureFactory,
    } = makeIdentityFactories(app);
    
    const privateKey = (await privateKeyFactory.fromMnemonic(mnemonic))
    const publicKey = (await publicKeyFactory.fromMnemonic(mnemonic))
    const signature = await signatureFactory.sign(Buffer.from(message), Buffer.from(privateKey, "hex"));

    console.log("Mnemonic: ", mnemonic);
    console.log("Public Key: ", publicKey);
    console.log();

    console.log("Message: ", message);
    console.log("Signature: ", signature);
};

main();
