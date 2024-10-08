import * as Client from "./client.js";

import { Config, EthViewParameters } from "./types.js";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { decodeFunctionResult, encodeFunctionData } from "viem";

import { Application } from "@mainsail/kernel";
import { ConsensusAbi } from "@mainsail/evm-contracts";
import { EvmCallBuilder } from "@mainsail/crypto-transaction-evm-call";
import { getApplication } from "./boot.js";

const getWalletNonce = async (app: Application, config: Config): Promise<number> => {
    const { peer, senderPassphrase } = config.cli;

    const { addressFactory } = makeIdentityFactories(app);

    const walletAddress = await addressFactory.fromMnemonic(senderPassphrase);

    let walletNonce = 0;
    try {
        walletNonce = await Client.getWalletNonce(peer, walletAddress);
    } catch (e) {}

    console.log(`>> using wallet: ${walletAddress} nonce: ${walletNonce}`);

    return walletNonce;
};

export const makeTransfer = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli, crypto } = config;
    const { transfer, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const signed = await app
        .resolve(EvmCallBuilder)
        .fee(transfer.gasPrice)
        .network(crypto.network.pubKeyHash)
        .gasLimit(21000)
        .nonce(walletNonce.toFixed(0))
        .recipientId(transfer.recipientAddress)
        .amount(transfer.value)
        .payload("")
        .sign(senderPassphrase);

    return signed.build();
};

export const makeVote = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli, crypto } = config;
    const { wellKnownContracts, vote, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const data = encodeFunctionData({
        abi: ConsensusAbi.abi,
        functionName: "vote",
        args: [vote.voteAddress],
    });

    let builder = app
        .resolve(EvmCallBuilder)
        .fee(vote.gasPrice)
        .network(crypto.network.pubKeyHash)
        .gasLimit(200_000)
        .nonce(walletNonce.toFixed(0))
        .recipientId(wellKnownContracts.consensus)
        .payload(data.slice(2));

    // TODO: unvote

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeValidatorRegistration = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli, crypto } = config;
    const { wellKnownContracts, validatorRegistration, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const data = encodeFunctionData({
        abi: ConsensusAbi.abi,
        functionName: "registerValidator",
        args: [`0x${validatorRegistration.validatorPublicKey}`],
    });

    const signed = await app
        .resolve(EvmCallBuilder)
        .fee(validatorRegistration.gasPrice)
        .network(crypto.network.pubKeyHash)
        .gasLimit(500_000)
        .nonce(walletNonce.toFixed(0))
        .recipientId(wellKnownContracts.consensus)
        .payload(data.slice(2))
        .sign(senderPassphrase);

    return signed.build();
};

export const makeValidatorResignation = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli, crypto } = config;
    const { wellKnownContracts, validatorResignation, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const data = encodeFunctionData({
        abi: ConsensusAbi.abi,
        functionName: "deregisterValidator",
        args: [],
    });

    const signed = await app
        .resolve(EvmCallBuilder)
        .fee(validatorResignation.gasPrice)
        .network(crypto.network.pubKeyHash)
        .gasLimit(150_000)
        .nonce(walletNonce.toFixed(0))
        .recipientId(wellKnownContracts.consensus)
        .payload(data.slice(2))
        .sign(senderPassphrase);

    return signed.build();
};

// export const makeUsernameRegistration = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
//     const { cli } = config;
//     const { userNameRegistration, senderPassphrase } = cli;

//     const app = await getApplication(config);

//     const walletNonce = await getWalletNonce(app, config);

//     const signed = await app
//         .resolve(UsernameRegistrationBuilder)
//         .fee(userNameRegistration.fee)
//         .nonce((walletNonce + 1).toFixed(0))
//         .usernameAsset(userNameRegistration.username)
//         .sign(senderPassphrase);

//     return signed.build();
// };

// export const makeUsernameResignation = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
//     const { cli } = config;
//     const { userNameResignation, senderPassphrase } = cli;

//     const app = await getApplication(config);

//     const walletNonce = await getWalletNonce(app, config);

//     const signed = await app
//         .resolve(UsernameResignationBuilder)
//         .fee(userNameResignation.fee)
//         .nonce((walletNonce + 1).toFixed(0))
//         .sign(senderPassphrase);

//     return signed.build();
// };

// export const makeMultiPayment = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
//     const { cli } = config;
//     const { multiPayment, senderPassphrase } = cli;

//     const app = await getApplication(config);

//     const walletNonce = await getWalletNonce(app, config);

//     let builder = app
//         .resolve(MultiPaymentBuilder)
//         .fee(multiPayment.fee)
//         .nonce((walletNonce + 1).toFixed(0))
//         .vendorField(multiPayment.vendorField);

//     for (const { amount, recipientId } of multiPayment.payments) {
//         builder = builder.addPayment(recipientId, amount);
//     }

//     const signed = await builder.sign(senderPassphrase);

//     return signed.build();
// };

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
            "wallet",
        ),

        wifFactory: app.getTagged<Contracts.Crypto.WIFFactory>(
            Identifiers.Cryptography.Identity.Wif.Factory,
            "type",
            "wallet",
        ),
    };
};
