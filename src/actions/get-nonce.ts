import { makeApplication } from "../boot.js";
import { loadConfig } from "../loader.js";
import { makeIdentityFactories } from "../builder.js";
import { getArgs } from "../utils.js";

import * as Client from "../client.js";

const main = async (customArgs?: string[]) => {
    const config = loadConfig();

    const { args } = getArgs(customArgs);

    const passphrase = args.length === 1 ? args[0] : config.cli.senderPassphrase;
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
