import * as Loader from "./loader";
import * as Client from "./client";
import { Identities, Managers } from "@arkecosystem/crypto";

const config = Loader.loadConfig();
const cryptoConfig = Loader.loadCryptoConfig();

Managers.configManager.setConfig(cryptoConfig);

console.log(config);
console.log(cryptoConfig);

const main = async () => {
    console.log(await Client.getWalletNonce(config.peer, Identities.Address.fromPassphrase(config.senderPassphrase)));
};

main();
