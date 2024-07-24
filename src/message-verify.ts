import crypto  from "crypto";
import { getApplication } from "./boot.js";
import { loadConfig } from "./loader.js";
import { makeIdentityFactories } from "./builder.js";

const main = async () => {
    const config = loadConfig();

    console.log('Message: ', config.cli.message.message);
    console.log('Public Key: ', config.cli.message.publicKey);
    console.log('Signature: ', config.cli.message.signature);

    const app = await getApplication(config);

    const {
        signatureFactory,
    } = makeIdentityFactories(app);

    const isValidSignature = await signatureFactory.verify(
        Buffer.from(config.cli.message.signature, "hex"),
        crypto.createHash('sha256').update(config.cli.message.message).digest(),
        Buffer.from(config.cli.message.publicKey, "hex")
    );

    console.log('Message verified: ' + isValidSignature);
};

main();
