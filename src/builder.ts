import { Contracts, Identifiers } from "@mainsail/contracts";
import { TransferBuilder } from "@mainsail/crypto-transaction-transfer";
import * as Client from "./client";
import { Config } from "./types";
import { getApplication } from "./boot";

export const makeTransfer = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { transfer, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { publicKeyFactory } = makeIdentityFactories(app);

    const senderPublicKey = await publicKeyFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, senderPublicKey);
    console.log(`>> using wallet: ${senderPublicKey} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(TransferBuilder)
        .fee(transfer.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .recipientId(transfer.recipientId)
        .amount(transfer.amount)
        .vendorField(transfer.vendorField)
        .sign(senderPassphrase);


    return signed.build();
}

const makeIdentityFactories = (app: Contracts.Kernel.Application): {
    addressFactory: Contracts.Crypto.AddressFactory,
    publicKeyFactory: Contracts.Crypto.PublicKeyFactory
} => {
    return {
        addressFactory: app.getTagged<Contracts.Crypto.AddressFactory>(
            Identifiers.Cryptography.Identity.Address.Factory,
            "type",
            "wallet",
        ),

        publicKeyFactory: app.getTagged<Contracts.Crypto.PublicKeyFactory>(
            Identifiers.Cryptography.Identity.PublicKey.Factory,
            "type",
            "wallet",
        )
    }
}
