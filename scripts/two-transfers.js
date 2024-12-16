import { main as getNonce } from "../dist/actions/get-nonce.js";
import { main as exec } from "../dist/index.js";

const main = async () => {
    let nonce = await getNonce();

    await exec(["1", `--nonce=${nonce++}`]);
    await exec(["1", `--nonce=${nonce++}`]);
};

main();
