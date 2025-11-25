import crypto from "@mainsail/core/bin/config/devnet/core/crypto.json" with { type: "json" };

export const devnet = {
    privateKey: "",
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    senderSecondPassphrase: "", // REPLACE senderSecondPassphrase WITH THE SECOND PASSPHRASE OF YOUR WALLET if you have one
    peer: "http://localhost:4008/api",
    crypto: crypto,
};
