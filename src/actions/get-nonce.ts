import { makeApplication } from "../boot.js";
import { loadConfig } from "../loader.js";
import { makeIdentityFactories } from "../builder.js";

import * as Client from "../client.js";

const main = async () => {
    const config = loadConfig();
    const passphrase = process.argv.length === 3 ? process.argv[2] : config.cli.senderPassphrase;
    const peer = config.cli.peer;

    const app = await makeApplication(config);

    const { addressFactory } = makeIdentityFactories(app);

    const walletAddress = await addressFactory.fromMnemonic(passphrase);

    let walletNonce = 0;
    try {
        walletNonce = await Client.getWalletNonce(peer, walletAddress);
    } catch (e) {}

    console.log(walletNonce);

    return walletNonce;
};

main();
