import { main as getNonce } from "../dist/actions/get-nonce.js";
import { main as exec } from "../dist/index.js";

const validators = [
    "0x07CDD5CB29a70ad52ba6F4ad9fb94d397a26486e",
    "0x137c59f371a7049159ef19a72f908773Ade219b1",
    "0x21c61c9E608df7ad6fD8730a0CEBe37A83B9F365",
    "0xa732C81De8a23d1aa2422463Fe7489b2cBCb48c4",
    "0x2a74550fC2e741118182B7ab020DC0B7Ed01e1db",
    "0x7AF9d8582F439ECC9d83c84a425DFbA422bc7a84",
    "0xb78843D7a0F237AA83911a9834Bf410C1b4c1CDe",
    "0xA71dAdA10295c14854B5FBc6D28eFd170e8470B4",
    "0x1Bf9cf8a006a5279ca81Ea9D3F6aC2D41e1353e2",
    "0x07Ac3E438719be72a9e2591bB6015F10E8Af2468",
    "0x2F61f2118fd6Fa819Cf1695642c14145a4539F9a",
    "0x09C94A51cb63b4b70A9Dbf190543c371741D13Fd",
    "0x373012E575CFD07dCd1139AEb3D71188677039be",
    "0x69aD988298FB856adD785070781aaE6370cf0093",
];

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
