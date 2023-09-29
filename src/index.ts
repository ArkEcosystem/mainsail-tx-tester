import * as Loader from "./loader";
import * as Client from "./client";
import { getApplication } from "./boot";
// @ts-ignore
import { TransferBuilder } from "../../mainsail/packages/crypto-transaction-transfer";
import { MultiPaymentBuilder } from "../../mainsail/packages/crypto-transaction-multi-payment";
import { Contracts, Identifiers } from "../../mainsail/packages/contracts";

const main = async () => {
    const config = Loader.loadConfig();

    const app = await getApplication(config);

    const peer = config.peers.list[0];
    const senderWallet = config.genesisWallet;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    const senderAddress = await app.getTagged<Contracts.Crypto.IAddressFactory>(
        Identifiers.Cryptography.Identity.AddressFactory,
        "type",
        "wallet",
    ).fromMnemonic(senderWallet.passphrase);



    const recipientPassphrase = config.validators.secrets[0];
    const recipientAddress = await app.getTagged<Contracts.Crypto.IAddressFactory>(
        Identifiers.Cryptography.Identity.AddressFactory,
        "type",
        "wallet",
    ).fromMnemonic(recipientPassphrase);

    // console.log({ senderAddress, recipientPassphrase, recipientAddress });

    const walletNonce = await Client.getWalletNonce(peer, senderAddress);
    console.log(`>> using wallet: ${senderAddress} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(MultiPaymentBuilder)
        .network(config.crypto.network.pubKeyHash)
        .fee("10000000")
        .nonce((walletNonce + 1).toFixed(0))
        .addPayment(recipientAddress, "1000000000")
        .addPayment(recipientAddress, "2000000000")
        .addPayment(recipientAddress, "3000000000")
        .sign(senderWallet.passphrase)

    // const signed = await app
    //     .resolve(TransferBuilder)
    //     .network(config.crypto.network.pubKeyHash)
    //     .fee("10000000")
    //     .nonce((walletNonce + 1).toFixed(0))
    //     .recipientId(recipientAddress)
    //     .amount("1000000000")
    //     .sign(senderWallet.passphrase)

    const struct = await signed.getStruct();
    console.log("struct", struct)
    await Client.postTransaction(peer, struct);
    console.log(`>> tx id: ${struct.id}`);
};

main();
