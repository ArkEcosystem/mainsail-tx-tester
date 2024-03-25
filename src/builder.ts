import { Contracts, Identifiers } from "@mainsail/contracts";
import { TransferBuilder } from "@mainsail/crypto-transaction-transfer";
import { VoteBuilder } from "@mainsail/crypto-transaction-vote";
import { UsernameRegistrationBuilder } from "@mainsail/crypto-transaction-username-registration";
import { UsernameResignationBuilder } from "@mainsail/crypto-transaction-username-resignation";
import { MultiPaymentBuilder } from "@mainsail/crypto-transaction-multi-payment";
import { ValidatorRegistrationBuilder } from "@mainsail/crypto-transaction-validator-registration";
import { ValidatorResignationBuilder } from "@mainsail/crypto-transaction-validator-resignation";
import * as Client from "./client.js";
import { Config } from "./types.js";
import { getApplication } from "./boot.js";

export const makeTransfer = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { transfer, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(TransferBuilder)
        .fee(transfer.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .recipientId(transfer.recipientId)
        .amount(transfer.amount)
        .vendorField(transfer.vendorField)
        .sign(senderPassphrase);

    return signed.build();
};

export const makeVote = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { vote, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    let builder = app
        .resolve(VoteBuilder)
        .fee(vote.fee)
        .nonce((walletNonce + 1).toFixed(0));

    if (vote.voteAsset) {
        builder = builder.votesAsset([vote.voteAsset]);
    }

    if (vote.unvoteAsset) {
        builder = builder.unvotesAsset([vote.unvoteAsset]);
    }

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeUsernameRegistration = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { userNameRegistration, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(UsernameRegistrationBuilder)
        .fee(userNameRegistration.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .usernameAsset(userNameRegistration.username)
        .sign(senderPassphrase);

    return signed.build();
};

export const makeUsernameResignation = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { userNameResignation, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(UsernameResignationBuilder)
        .fee(userNameResignation.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .sign(senderPassphrase);

    return signed.build();
};

export const makeMultiPayment = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { multiPayment, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    let builder = app
        .resolve(MultiPaymentBuilder)
        .fee(multiPayment.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .vendorField(multiPayment.vendorField);

    for (const { amount, recipientId } of multiPayment.payments) {
        builder = builder.addPayment(recipientId, amount);
    }

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeValidatorRegistration = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { validatorRegistration, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(ValidatorRegistrationBuilder)
        .fee(validatorRegistration.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .publicKeyAsset(validatorRegistration.validatorPublicKey)
        .sign(senderPassphrase);

    return signed.build();
};

export const makeValidatorResignation = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { validatorResignation, peer, senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const address = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, address);
    console.log(`>> using wallet: ${address} nonce: ${walletNonce}`);

    const signed = await app
        .resolve(ValidatorResignationBuilder)
        .fee(validatorResignation.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .sign(senderPassphrase);

    return signed.build();
};

export const makeIdentityFactories = (
    app: Contracts.Kernel.Application,
): {
    addressFactory: Contracts.Crypto.AddressFactory;
    publicKeyFactory: Contracts.Crypto.PublicKeyFactory;
    privateKeyFactory: Contracts.Crypto.PrivateKeyFactory;
    consensusPublicKeyFactory: Contracts.Crypto.PublicKeyFactory;
    consensusPrivateKeyFactory: Contracts.Crypto.PrivateKeyFactory;
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
        ),

        privateKeyFactory: app.getTagged<Contracts.Crypto.PublicKeyFactory>(
            Identifiers.Cryptography.Identity.PrivateKey.Factory,
            "type",
            "wallet",
        ),

        consensusPublicKeyFactory: app.getTagged<Contracts.Crypto.PublicKeyFactory>(
            Identifiers.Cryptography.Identity.PublicKey.Factory,
            "type",
            "consensus",
        ),

        consensusPrivateKeyFactory: app.getTagged<Contracts.Crypto.PublicKeyFactory>(
            Identifiers.Cryptography.Identity.PrivateKey.Factory,
            "type",
            "consensus",
        ),
    };
};
