import { keccak256, toHex } from "viem";

import { loadConfig } from "./loader.js";
import { makeApplication } from "../boot.js";
import { makeIdentityFactories } from "../builder.js";

const main = async () => {
    const config = loadConfig();
    const app = await makeApplication();

    const { privateKeyFactory, publicKeyFactory, signatureFactory } = makeIdentityFactories(app);

    const privateKey = await privateKeyFactory.fromMnemonic(config.senderPassphrase);
    const publicKey = await publicKeyFactory.fromMnemonic(config.senderPassphrase);
    const signature = await signatureFactory.signRecoverable(
        Buffer.from(keccak256(toHex(config.message.message)).slice(2), "hex"),
        Buffer.from(privateKey, "hex"),
    );

    console.log("Mnemonic: ", config.senderPassphrase);
    console.log("Public Key: ", publicKey);
    console.log();

    console.log("Message: ", config.message.message);
    console.log("Signature: ", signature.r + signature.s + signature.v.toString(16));
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
