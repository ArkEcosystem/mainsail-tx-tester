import { testnet } from "./networks/testnet.js";
import { devnet } from "./networks/devnet.js";
import { geth } from "./networks/geth.js";

import { consensus } from "./contracts/consensus.js";
import { usernames } from "./contracts/usernames.js";
import { multiPayment } from "./contracts/multipayment.js";
import { dark20 } from "./contracts/dark20.js";
import { revert } from "./contracts/revert.js";
import { test } from "./contracts/test.js";

const config = {
    ...geth,
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
};

export default config;
