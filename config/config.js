import { consensus } from "./contracts/consensus.js";
import { dark20 } from "./contracts/dark20.js";
import { mainsailerc20 } from "./contracts/mainsailerc20.js";
import { erc20batchtransfer } from "./contracts/erc20batchtransfer.js";
import { multiPayment } from "./contracts/multipayment.js";
import { revert } from "./contracts/revert.js";
import { test } from "./contracts/test.js";
import { testnet } from "./networks/testnet.js";
import { usernames } from "./contracts/usernames.js";

// Other network options:
// import { devnet } from "./networks/devnet.js";
// import { geth } from "./networks/geth.js";
// import { reth } from "./networks/reth.js";
// import { anvil } from "./networks/anvil.js";

const config = {
    ...testnet, // set network here
    gasPrice: 5_000_000_000,
    gasLimit: 5_000_000,
    transfer: {
        recipientAddress: "0xC870aF84F11e0d43c8a29C041F23a8E85a2Ce4ff",
        value: "5000000000000000000", // 5 ARK
    },
    contracts: {
        consensus,
        usernames,
        mainsailerc20,
        multiPayment,
        dark20,
        revert,
        test,
        erc20batchtransfer,
    },
    message: {
        publicKey: "0243333347c8cbf4e3cbc7a96964181d02a2b0c854faa2fef86b4b8d92afcf473d",
        message: "Hello, world!",
        signature:
            "0e2e53409be748834cac44052817ecef569b429a0492aa6bbc0d934eb71a09547e77aeef33d45669bbcba0498149f0e2b637fe8905186e08a5410c6f2b013bb41b",
    },
};

export default config;
