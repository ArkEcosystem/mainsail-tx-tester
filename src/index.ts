import * as Loader from "./loader";
import * as Client from "./client";
import { getApplication } from "./boot";
import { TransferBuilder } from "../../mainsail/packages/crypto-transaction-transfer";
import { Contracts, Identifiers } from "../../mainsail/packages/contracts";

const main = async () => {
    const config = Loader.loadConfig();

    const app = await getApplication(config);

    const peer = config.peers.list[0];
    const recipientWallet = config.genesisWallet;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    const senderPassphrase = config.validators.secrets[0];
    const senderAddress = await app.getTagged<Contracts.Crypto.IAddressFactory>(
        Identifiers.Cryptography.Identity.AddressFactory,
        "type",
        "wallet",
    ).fromMnemonic(senderPassphrase);
    console.log({ senderAddress, senderPassphrase });

    const walletNonce = await Client.getWalletNonce(peer, senderAddress);
    console.log(`>> using wallet: ${senderAddress} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(TransferBuilder)
        .network(config.crypto.network.pubKeyHash)
        .fee("10000000")
        .nonce((walletNonce + 1).toFixed(0))
        .recipientId(recipientWallet.address)
        .amount("1000000000")
        .sign(senderPassphrase)

    const struct = await signed.getStruct();
    await Client.postTransaction(peer, struct);
    console.log(`>> tx id: ${struct.id}`);
};

main();
