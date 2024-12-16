import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };
import DARK20 from "./builds/DARK20.json" with { type: "json" };
import { consensus } from "./contracts/consensus.js";
import { usernames } from "./contracts/usernames.js";
import { multiPayment } from "./contracts/multipayment.js";
import { dark20 } from "./contracts/dark20.js";

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
        dark20,
    },
    message: {
        publicKey: "037a62215a2adb6ea17c079262c76e3aa35293b0a575608174505de12de9181110",
        message: "Hello World",
        signature:
            "20dc527c2d85e3b790359d64276b8931e89647d628ab57be99bb7dabfae28932c8a44b7c3fc805b67678b25beed1d481c3df663c17cf9ddc4f5485211fc4baed",
    },
    crypto: crypto,
};

export default config;
