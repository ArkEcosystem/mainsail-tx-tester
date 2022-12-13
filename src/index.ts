import * as Loader from "./loader";
import * as Client from "./client";
import * as Builder from "./builder";
import { Identities, Managers } from "@arkecosystem/crypto";

const main = async () => {
    const config = Loader.loadConfig();
    const cryptoConfig = Loader.loadCryptoConfig();

    Managers.configManager.setConfig(cryptoConfig);
    Managers.configManager.setHeight(await Client.getHeight(config.peer));

    const nonce = await Client.getWalletNonce(config.peer, Identities.Address.fromPassphrase(config.senderPassphrase));

    const transfer = Builder.makeTransfer(config.senderPassphrase, nonce, config.transfer);

    await Client.postTransaction(config.peer, transfer.data);
};

main();
