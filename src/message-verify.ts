import crypto  from "crypto";
// import { generateMnemonic } from "bip39";
import { getApplication } from "./boot.js";
import { loadConfig } from "./loader.js";
import { makeIdentityFactories } from "./builder.js";

const main = async () => {

    const [message, publicKey, signature] = process.argv.slice(2);

    console.log('Message: ', message);
    console.log('Public Key: ', publicKey);
    console.log('Signature: ', signature);

    const app = await getApplication(loadConfig());

    const {
        signatureFactory,
    } = makeIdentityFactories(app);

    const check = await signatureFactory.verify(Buffer.from(signature, "hex"), crypto.createHash('sha256').update(message).digest(), Buffer.from(publicKey));
    console.log(check);
};

main();
