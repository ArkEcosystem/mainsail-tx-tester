import crypto from "@mainsail/core/bin/config/devnet/core/crypto.json" with { type: "json" };

export const devnet = {
    privateKey: "",
    senderPassphrase:
        "render can fun volcano need extra famous cool similar whale skull wolf blue bind left bounce gentle deliver vote hero sadness vocal shop flower", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    senderSecondPassphrase: "", // REPLACE senderSecondPassphrase WITH THE SECOND PASSPHRASE OF YOUR WALLET if you have one
    peer: "http://localhost:4008/api",
    waitForBlock: true,
    crypto: crypto,
};
