import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };
import DARK20 from "./DARK20.json" with { type: "json" };
import { consensus } from "./consensus.js";
import { usernames } from "./usernames.js";
import { multiPayment } from "./multipayment.js";

const config = {
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    peer: {
        apiTxPoolUrl: "https://dwallets-evm.mainsailhq.com/tx",
        apiEvmUrl: "https://dwallets-evm.mainsailhq.com/evm",
    },
    gasPrice: "5",
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
    },
    crypto: crypto,
};

export default config;
