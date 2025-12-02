import crypto from "./geth.json" with { type: "json" };

export const geth = {
    privateKey: "b71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291",
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    senderSecondPassphrase: "", // REPLACE senderSecondPassphrase WITH THE SECOND PASSPHRASE OF YOUR WALLET if you have one
    peer: "http://192.168.50.202:8545",
    waitForBlock: false,
    crypto: crypto,
};
