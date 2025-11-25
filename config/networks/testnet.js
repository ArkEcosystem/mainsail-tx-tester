import crypto from "mainsail-network-config/testnet/mainsail/crypto.json" with { type: "json" };

export const testnet = {
    privateKey: "",
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    senderSecondPassphrase: "", // REPLACE senderSecondPassphrase WITH THE SECOND PASSPHRASE OF YOUR WALLET if you have one
    peer: "https://testnet.mainsailhq.com/rpc/api",
    crypto: crypto,
};
