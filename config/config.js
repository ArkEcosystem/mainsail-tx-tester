import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };
import DARK20 from "./builds/DARK20.json" with { type: "json" };
import { consensus } from "./contracts/consensus.js";
import { usernames } from "./contracts/usernames.js";
import { multiPayment } from "./contracts/multipayment.js";
import { dark20 } from "./contracts/dark20.js";
import { revert } from "./contracts/revert.js";
import { tokenTransfer } from "./contracts/tokentransfer.js";

const config = {
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    peer: {
        apiTxPoolUrl: "https://dwallets-evm.mainsailhq.com/tx",
        apiEvmUrl: "https://dwallets-evm.mainsailhq.com/evm",
    },
    gasPrice: "5000000000",
    transfer: {
        recipientAddress: "0xb693449AdDa7EFc015D87944EAE8b7C37EB1690A",
        value: "100000000",
    },
    evmDeploy: {
        data: DARK20.bytecode,
        vendorField: "",
    },
    contracts: {
        consensus,
        usernames,
        multiPayment,
        dark20,
        revert,
        tokenTransfer,
    },
    message: {
        publicKey: "0243333347c8cbf4e3cbc7a96964181d02a2b0c854faa2fef86b4b8d92afcf473d",
        message: "Hello World",
        signature:
            "3c2a3259b9ef6d6b8ebd5a363a8403d3d6871c83a2ab1525a579a5918c945d77069c9e9993860a522a3887ba98e342991c392ac768506d50ab8c7c2c2c442e961c",
    },
    crypto: crypto,
};

export default config;
