import { main as getNonce } from "../dist/actions/get-nonce.js";
import { main as exec } from "../dist/index.js";

const main = async () => {
    let nonce = await getNonce();

    // Invalid contract call by using Usernames ABI on MultiPayment contract
    await exec(["7", "0", `--nonce=${nonce++}`]);
};

main();
