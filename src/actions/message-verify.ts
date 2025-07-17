import { keccak256, toHex } from "viem";

import { loadConfig } from "../loader.js";
import { makeApplication } from "../boot.js";
import { makeIdentityFactories } from "../builder.js";

const main = async () => {
    const config = loadConfig();
    const app = await makeApplication(config);

    console.log("Message: ", config.cli.message.message);
    console.log("Public Key: ", config.cli.message.publicKey);
    console.log("Signature: ", config.cli.message.signature);

    const { signatureFactory } = makeIdentityFactories(app);

    const isValidSignature = await signatureFactory.verifyRecoverable(
        {
            r: config.cli.message.signature.slice(0, 64),
            s: config.cli.message.signature.slice(64, 128),
            v: parseInt(config.cli.message.signature.slice(128), 16),
        },
        Buffer.from(keccak256(toHex(config.cli.message.message)).slice(2), "hex"),
        Buffer.from(config.cli.message.publicKey, "hex"),
    );

    console.log("Message verified: " + isValidSignature);
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
