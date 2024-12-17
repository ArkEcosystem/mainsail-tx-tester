import { main as getNonce } from "../dist/actions/get-nonce.js";
import { main as exec } from "../dist/index.js";

import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };

// const validators = [
//     "0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5",
//     "0x2DF47283753D179929dF7FFd1f2f2f6011ef10EE",
//     "0x3b3254D924916365A4b71aFC3291e7BcfeC03C6D",
//     "0xC73b2668Bab0648026c3b308c9E58F7a5F9a3652",
//     "0x950789c48D4624FF366cFD9f7E96278D92D50c11",
//     "0x0c3345B281c3D0550c58EeBa3D3A9CAB3c77c0F4",
//     "0x5cE62512aD72B100eeb48bC5847FaCA541b77761",
//     "0x15026BF0Bd2DB4018FE395d329fcb67Ff634Bc1E",
// ];

const validators = crypto.genesisBlock.block.transactions.slice(0, 10).map((tx) => tx.recipientAddress);

const main = async () => {
    let nonce = await getNonce();

    // Transfer
    await exec(["1", `--nonce=${nonce++}`]);

    // Multipayment
    await exec([
        "5",
        "0",
        `[${JSON.stringify(validators)}, ${JSON.stringify(validators.map(() => 1))}]`,
        `${validators.length}`,
        `--nonce=${nonce++}`,
    ]);

    // Vote another
    const validator = validators[Math.floor(Math.random() * validators.length)];
    await exec(["3", "3", `["${validator}"]`, `--nonce=${nonce++}`]);

    // Register username
    const username = Array.from({ length: 15 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join(
        "",
    );
    await exec(["4", "0", `["${username}"]`, `--nonce=${nonce++}`]);

    // Reverted tx
    await exec(["7", "0", `--nonce=${nonce++}`]);
};

main();
