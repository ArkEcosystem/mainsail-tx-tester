import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };
import DARK20 from "./DARK20.json" with { type: "json" };
import { consensus } from "./consensus.js";
import { usernames } from "./usernames.js";
import { multiPayment } from "./multipayment.js";

const config = {
    senderPassphrase:
        "bullet mean oxygen possible quiz body range ozone quantum elevator inspire cute inject work estate century must this defy siren aisle rich churn explain", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    peer: {
        apiTxPoolUrl: "http://127.0.0.1:4007",
        apiEvmUrl: "http://127.0.0.1:4008",
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
