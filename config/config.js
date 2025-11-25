import crypto from "@mainsail/core/bin/config/devnet/core/crypto.json" with { type: "json" };
// import crypto from "mainsail-network-config/testnet/mainsail/crypto.json" with { type: "json" };
import { consensus } from "./contracts/consensus.js";
import { usernames } from "./contracts/usernames.js";
import { multiPayment } from "./contracts/multipayment.js";
import { dark20 } from "./contracts/dark20.js";
import { revert } from "./contracts/revert.js";
import { test } from "./contracts/test.js";

const config = {
    privateKey: "",
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    senderSecondPassphrase: "", // REPLACE senderSecondPassphrase WITH THE SECOND PASSPHRASE OF YOUR WALLET if you have one
    peer: "http://localhost:4008/api",
    // peer: "http://192.168.50.202:8545",
    gasPrice: 5000000000,
    transfer: {
        recipientAddress: "0xC870aF84F11e0d43c8a29C041F23a8E85a2Ce4ff",
        value: "350000000000000000000",
    },
    contracts: {
        consensus,
        usernames,
        multiPayment,
        dark20,
        revert,
        test,
    },
    message: {
        publicKey: "0243333347c8cbf4e3cbc7a96964181d02a2b0c854faa2fef86b4b8d92afcf473d",
        message: "Hello, world!",
        signature:
            "0e2e53409be748834cac44052817ecef569b429a0492aa6bbc0d934eb71a09547e77aeef33d45669bbcba0498149f0e2b637fe8905186e08a5410c6f2b013bb41b",
    },
    crypto: crypto,
};

export default config;
