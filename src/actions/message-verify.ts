import { keccak256, toHex } from "viem";

import { makeApplication } from "../boot.js";
import { makeIdentityFactories, loadConfig } from "./utils.js";

const main = async () => {
    const config = loadConfig();
    const app = await makeApplication();

    console.log("Message: ", config.message.message);
    console.log("Public Key: ", config.message.publicKey);
    console.log("Signature: ", config.message.signature);

    const { signatureFactory } = makeIdentityFactories(app);

    const isValidSignature = await signatureFactory.verifyRecoverable(
        {
            r: config.message.signature.slice(0, 64),
            s: config.message.signature.slice(64, 128),
            v: parseInt(config.message.signature.slice(128), 16),
        },
        Buffer.from(keccak256(toHex(config.message.message)).slice(2), "hex"),
        Buffer.from(config.message.publicKey, "hex"),
    );

    console.log("Message verified: " + isValidSignature);
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
