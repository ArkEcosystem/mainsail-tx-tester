import * as Client from "./client.js";

import { Config, EthViewParameters, ContractData } from "./types.js";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { decodeFunctionResult, encodeFunctionData } from "viem";

import { Application } from "@mainsail/kernel";
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

export const makeTransfer = async (
    config: Config,
    recipient?: string,
    amount?: string,
): Promise<Contracts.Crypto.Transaction> => {
    const { cli, crypto } = config;
    const { transfer, senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const signed = await app
        .resolve(EvmCallBuilder)
        .gasPrice(transfer.gasPrice)
        .network(crypto.network.pubKeyHash)
        .gasLimit(21000)
        .nonce(walletNonce.toFixed(0))
        .recipientAddress(recipient ? recipient : transfer.recipientAddress)
        .value(amount ? amount : transfer.value)
        .payload("")
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
        .gasPrice(evmDeploy.gasPrice)
        .payload(evmDeploy.data.slice(2))
        .gasLimit(2_000_000)
        .nonce(walletNonce.toString())
        .vendorField(evmDeploy.vendorField);

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeEvmCall = async (
    config: Config,
    contractData: ContractData,
    functionIndex: number,
    args?: any[],
    amount?: string,
): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { senderPassphrase } = cli;

    const app = await getApplication(config);

    const walletNonce = await getWalletNonce(app, config);

    const func = contractData.transactions[functionIndex];

    const usedArgs = args || func.args;
    if (!amount) {
        amount = func.amount ? func.amount.toString() : "0";
    }

    const data = encodeFunctionData({
        abi: contractData.abi,
        functionName: func.functionName,
        args: usedArgs,
    });

    console.log(`Function: ${func.functionName}`);
    console.log(`Args:     ${usedArgs.join(", ")}`);
    console.log(`Encoded:  ${data}`);

    let builder = app
        .resolve(EvmCallBuilder)
        .gasPrice(cli.gasPrice)
        .payload(data.slice(2))
        .gasLimit(1_000_000)
        .recipientAddress(contractData.contractId)
        .value(amount)
        .nonce(walletNonce.toString());

    const signed = await builder.sign(senderPassphrase);

    return signed.build();
};

export const makeEvmView = async (
    config: Config,
    contractData: ContractData,
    index: number,
): Promise<EthViewParameters> => {
    const { cli } = config;
    const { senderPassphrase } = cli;

    const app = await getApplication(config);
    const { addressFactory } = makeIdentityFactories(app);

    const func = contractData.views[index];

    const data = encodeFunctionData({
        abi: contractData.abi,
        functionName: func.functionName,
        args: func.args,
    });

    console.log(`Function: ${func.functionName}`);
    console.log(`Args:     ${func.args.join(", ")}`);
    console.log(`Encoded:  ${data}`);

    return {
        from: await addressFactory.fromMnemonic(senderPassphrase),
        to: contractData.contractId,
        data: data,
    };
};

export const decodeEvmViewResult = (config: Config, contractData: ContractData, index: number, data: any): void => {
    const func = contractData.views[index];

    let result;
    try {
        result = decodeFunctionResult({
            abi: contractData.abi,
            functionName: func.functionName,
            data,
        });
    } catch (ex) {
        result = ex.message;
    }

    console.log(`Result:   ${data}`);
    console.log(`Decoded:`);
    console.log(`${JSON.stringify(result, (_, v) => (typeof v === "bigint" ? v.toString() : v), "  ")}`);
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
