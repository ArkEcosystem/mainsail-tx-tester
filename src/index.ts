import * as Loader from "./loader";
import * as Client from "./client";
import { Identities, Managers } from "@arkecosystem/crypto";

const main = async () => {
    const config = Loader.loadConfig();
    const cryptoConfig = Loader.loadCryptoConfig();

    Managers.configManager.setConfig(cryptoConfig);
    Managers.configManager.setHeight(await Client.getHeight(config.peer));

    console.log(await Client.getWalletNonce(config.peer, Identities.Address.fromPassphrase(config.senderPassphrase)));
};

main();
