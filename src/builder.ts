import * as Client from "./client.js";

import { Contracts, Identifiers } from "@mainsail/contracts";
import { encodeFunctionData, decodeFunctionResult } from "viem";

import { Application } from "@mainsail/kernel";
import { Config, EthViewParameters } from "./types.js";
import { MultiPaymentBuilder } from "@mainsail/crypto-transaction-multi-payment";
import { MultiSignatureBuilder } from "@mainsail/crypto-transaction-multi-signature-registration";
import { TransferBuilder } from "@mainsail/crypto-transaction-transfer";
import { UsernameRegistrationBuilder } from "@mainsail/crypto-transaction-username-registration";
import { UsernameResignationBuilder } from "@mainsail/crypto-transaction-username-resignation";
import { ValidatorRegistrationBuilder } from "@mainsail/crypto-transaction-validator-registration";
import { ValidatorResignationBuilder } from "@mainsail/crypto-transaction-validator-resignation";
import { EvmCallBuilder } from "@mainsail/crypto-transaction-evm-call";
import { VoteBuilder } from "@mainsail/crypto-transaction-vote";
import { getApplication } from "./boot.js";

const getWalletNonce = async (app: Application, config: Config): Promise<number> => {
    const { peer, senderPassphrase } = config.cli;

    const { addressFactory } = makeIdentityFactories(app);

    const walletAddress = await addressFactory.fromMnemonic(senderPassphrase);

    const walletNonce = await Client.getWalletNonce(peer, walletAddress);

    console.log(`>> using wallet: ${walletAddress} nonce: ${walletNonce}`);

    return walletNonce;
};

export const makeMultisignatureRegistration = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { multiSignatureRegistration, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const { publicKeyFactory } = makeIdentityFactories(app);

    const multisignatureAsset = {
        min: multiSignatureRegistration.min,
        publicKeys: await Promise.all(
            multiSignatureRegistration.participants.map(
                async (participant) => await publicKeyFactory.fromMnemonic(participant),
            ),
        ),
    };

    const transaction = await app
        .resolve(MultiSignatureBuilder)
        .fee(multiSignatureRegistration.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .senderPublicKey(await publicKeyFactory.fromMnemonic(senderPassphrase))
        .multiSignatureAsset(multisignatureAsset);

    // Sign with each participant
    for (const [index, participant] of multiSignatureRegistration.participants.entries()) {
        await transaction.multiSign(participant, index);
    }

    // Sign with the sender
    const signed = await transaction.sign(senderPassphrase);

    return signed.build();
};

export const makeTransfer = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { transfer, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

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
    const { vote, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

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
    const { userNameRegistration, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

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
    const { userNameResignation, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const signed = await app
        .resolve(UsernameResignationBuilder)
        .fee(userNameResignation.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .sign(senderPassphrase);

    return signed.build();
};

export const makeMultiPayment = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { multiPayment, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

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
    const { validatorRegistration, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

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
    const { validatorResignation, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const signed = await app
        .resolve(ValidatorResignationBuilder)
        .fee(validatorResignation.fee)
        .nonce((walletNonce + 1).toFixed(0))
        .sign(senderPassphrase);

    return signed.build();
};

export const makeEvmDeploy = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { evmDeploy, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    let builder = app
        .resolve(EvmCallBuilder)
        .fee(evmDeploy.fee)
        .payload(evmDeploy.data.slice(2))
        .gasLimit(2_000_000)
        .nonce((walletNonce + 1).toString())
        .vendorField(evmDeploy.vendorField);

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeEvmCall = async (
    config: Config,
    functionIndex: number,
    args?: any[],
): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { evmCall, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const func = evmCall.functions[functionIndex];

    const usedArgs = args || func.args;

    const data = encodeFunctionData({
        abi: evmCall.abi,
        functionName: func.functionName,
        args: usedArgs,
    });

    console.log(`>> Contract: ${evmCall.contractId}`);
    console.log(`   Function: ${func.functionName}`);
    console.log(`   Args:     ${usedArgs.join(", ")}`);
    console.log(`   Encoded:  ${data}`);

    let builder = app
        .resolve(EvmCallBuilder)
        .fee(evmCall.fee)
        .payload(data.slice(2))
        .gasLimit(1_000_000)
        .recipientId(evmCall.contractId)
        .nonce((walletNonce + 1).toString())
        .vendorField(evmCall.vendorField);

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeEvmView = async (config: Config, functionIndex: number): Promise<EthViewParameters> => {
    const { cli } = config;
    const { senderPassphrase, evmView } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const func = evmView.functions[functionIndex];

    const data = encodeFunctionData({
        abi: evmView.abi,
        functionName: func.functionName,
        args: func.args,
    });

    console.log(``);
    console.log(`>> Contract: ${evmView.contractId}`);
    console.log(`   Function: ${func.functionName}`);
    console.log(`   Args:     ${func.args.join(", ")}`);
    console.log(`   Encoded:  ${data}`);

    return {
        from: await addressFactory.fromMnemonic(senderPassphrase),
        to: evmView.contractId,
        data: data,
    };
};

export const decodeEvmViewResult = (config: Config, functionIndex: number, data: string): void => {
    const { cli } = config;
    const { evmView } = cli;

    const func = evmView.functions[functionIndex];

    let result;
    try {
        result = decodeFunctionResult({
            abi: evmView.abi,
            functionName: func.functionName,
            data,
        });
    } catch (ex) {
        result = ex.message;
    }

    console.log(``);
    console.log(`>> Result:   ${data}`);
    console.log(`   Decoded:  ${result}`);
};

export const makeIdentityFactories = (
    app: Contracts.Kernel.Application,
): {
    addressFactory: Contracts.Crypto.AddressFactory;
    publicKeyFactory: Contracts.Crypto.PublicKeyFactory;
    privateKeyFactory: Contracts.Crypto.PrivateKeyFactory;
    consensusPublicKeyFactory: Contracts.Crypto.PublicKeyFactory;
    consensusPrivateKeyFactory: Contracts.Crypto.PrivateKeyFactory;
    signatureFactory: Contracts.Crypto.Signature;
    wifFactory: Contracts.Crypto.WIFFactory;
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

        signatureFactory: app.getTagged<Contracts.Crypto.Signature>(
            Identifiers.Cryptography.Signature.Instance,
            "type",
            "consensus",
        ),

        wifFactory: app.getTagged<Contracts.Crypto.WIFFactory>(
            Identifiers.Cryptography.Identity.Wif.Factory,
            "type",
            "wallet",
        ),
    };
};
