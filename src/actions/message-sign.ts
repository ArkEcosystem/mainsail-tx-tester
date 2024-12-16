import crypto from "crypto";
import { makeApplication } from "../boot.js";
import { loadConfig } from "../loader.js";
import { makeIdentityFactories } from "../builder.js";

const main = async () => {
    const config = loadConfig();
    const app = await makeApplication(config);

    const { privateKeyFactory, publicKeyFactory, signatureFactory } = makeIdentityFactories(app);

    const privateKey = await privateKeyFactory.fromMnemonic(config.cli.senderPassphrase);
    const publicKey = await publicKeyFactory.fromMnemonic(config.cli.senderPassphrase);
    const signature = await signatureFactory.sign(
        crypto.createHash("sha256").update(config.cli.message.message).digest(),
        Buffer.from(privateKey, "hex"),
    );

    console.log("Mnemonic: ", config.cli.senderPassphrase);
    console.log("Public Key: ", publicKey);
    console.log();

    console.log("Message: ", config.cli.message.message);
    console.log("Signature: ", signature);
};

main();
