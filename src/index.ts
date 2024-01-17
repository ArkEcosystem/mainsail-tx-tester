import * as Loader from "./loader";
import * as Client from "./client";
// // @ts-ignore
// import { TransferBuilder } from "../../mainsail/packages/crypto-transaction-transfer";
// // @ts-ignore
// import { MultiPaymentBuilder } from "../../mainsail/packages/crypto-transaction-multi-payment";
// // @ts-ignore
// import { VoteBuilder } from "../../mainsail/packages/crypto-transaction-vote/distribution";
// // @ts-ignore
// import { MultiSignatureBuilder } from "../../mainsail/packages/crypto-transaction-multi-signature-registration";
import { makeTransfer } from "./builder";

const main = async () => {
    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);


    const tx = await makeTransfer(
        config,
    );

    await Client.postTransaction(peer, tx.serialized.toString("hex"));
    console.log(`>> sent tx ${tx.id} to ${peer.ip}`);
};

main();

// const builder = app
//     .resolve(MultiPaymentBuilder)
//     .network(config.crypto.network.pubKeyHash)
//     .fee("10000000")
//     .vendorField(Buffer.from("a".repeat(255), "utf8").toString("utf8"))
//     .nonce((walletNonce + 1).toFixed(0));

// for (let i = 0; i < 125; i++) {
//     builder.addPayment(recipientAddress, `${i + 1}000000000`)
// }

// const signed = await builder.sign(senderWallet.passphrase);

// const signed = await app
//     .resolve(TransferBuilder)
//     .network(config.crypto.network.pubKeyHash)
//     .fee("10000000")
//     .nonce((walletNonce + 1).toFixed(0))
//     .recipientId(recipientAddress)
//     .amount("1000000000")
//     .vendorField("Hello Mainsail")
//     .sign(senderWallet.passphrase)

// const payload = app
//     .resolve(MultiSignatureBuilder)
//     .network(config.crypto.network.pubKeyHash)
//     .fee("500000000")
//     .nonce((walletNonce + 1).toFixed(0))
//     .recipientId(recipientAddress)
//     .min(2)
//     .participant(senderPublicKey)
//     .participant(senderPublicKey2)
//     .vendorField("Hello Mainsail");

// await payload.multiSign(senderWallet.passphrase, 0);
// await payload.multiSign(config.validators.secrets[1], 1);

// await payload.sign(senderWallet.passphrase);

// const signed = await app
//     .resolve(VoteBuilder)
//     .network(config.crypto.network.pubKeyHash)
//     .fee("100000000")
//     .nonce((walletNonce + 1).toFixed(0))
//     .recipientId(recipientAddress)
//     .votesAsset(["4724580539e22dde52d257f3e39e6fa9911659ddcc31b8b2971b5ed20e10e873"])
//     .sign(senderWallet.passphrase)
