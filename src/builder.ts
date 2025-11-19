import * as Client from "./client.js";

import { Config, ContractData, EthViewParameters } from "./types.js";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { AbiFunction, decodeFunctionResult, encodeFunctionData } from "viem";

import { AppIdentifiers } from "./identifiers.js";
import { Application } from "@mainsail/kernel";
import { TransactionBuilder } from "@mainsail/crypto-transaction";
import { getApplication } from "./boot.js";

export const getWalletNonce = async (app: Application, config: Config): Promise<number> => {
    const { peer } = config.cli;

    const { addressFactory } = makeIdentityFactories(app);

    const walletAddress = await addressFactory.fromMnemonic(app.get(AppIdentifiers.WalletPassphrase));

    if (app.isBound(AppIdentifiers.WalletNonce)) {
        return app.get<number>(AppIdentifiers.WalletNonce);
    }

    let walletNonce = 0;
    try {
        walletNonce = await Client.getWalletNonce(peer, walletAddress);
    } catch (e) {}

    console.log(`Using wallet: ${walletAddress} nonce: ${walletNonce}`);

    return walletNonce;
};

export const makeTransfer = async (
    config: Config,
    recipient?: string,
    amount?: string,
): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { transfer } = cli;

    const app = getApplication();

    const walletNonce = await getWalletNonce(app, config);

    let builder = app
        .resolve(TransactionBuilder)
        .gasPrice(cli.gasPrice)
        .gasLimit(21000)
        .nonce(walletNonce.toFixed(0))
        .recipientAddress(recipient ? recipient : transfer.recipientAddress)
        .value(amount ? amount : transfer.value)
        .payload("");

    const signed = await signTransaction(app, builder, cli);

    return signed.build();
};

export const makeEvmDeploy = async (config: Config): Promise<Contracts.Crypto.Transaction> => {
    const { cli } = config;
    const { deploy } = cli;

    const app = getApplication();

    const walletNonce = await getWalletNonce(app, config);

    let builder = app
        .resolve(TransactionBuilder)
        .gasPrice(cli.gasPrice)
        .payload(deploy.data.slice(2))
        .gasLimit(2_000_000)
        .nonce(walletNonce.toString());

    const signed = await signTransaction(app, builder, cli);

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

    const app = getApplication();

    const walletNonce = await getWalletNonce(app, config);

    const func = contractData.transactions[functionIndex];

    const usedArgs = args || func.args;

    normalizeContractCallArgs(contractData, func.functionName, usedArgs);

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
    console.log(`Amount:     ${amount}`);
    console.log(`Encoded:  ${data}`);

    let builder = app
        .resolve(TransactionBuilder)
        .gasPrice(cli.gasPrice)
        .payload(data.slice(2))
        .gasLimit(1_000_000)
        .recipientAddress(contractData.contractId)
        .value(amount)
        .nonce(walletNonce.toString());

    const signed = await signTransaction(app, builder, cli);

    return signed.build();
};

export const makeEvmView = async (
    config: Config,
    contractData: ContractData,
    index: number,
): Promise<EthViewParameters> => {
    const app = getApplication();
    const { addressFactory } = makeIdentityFactories(app);

    const func = contractData.views[index];

    const args = func.args;

    normalizeContractCallArgs(contractData, func.functionName, args);

    const data = encodeFunctionData({
        abi: contractData.abi,
        functionName: func.functionName,
        args,
    });

    console.log(`Function: ${func.functionName}`);
    console.log(`Args:     ${args.join(", ")}`);
    console.log(`Encoded:  ${data}`);

    return {
        from: await addressFactory.fromMnemonic(app.get(AppIdentifiers.WalletPassphrase)),
        to: contractData.contractId,
        data: data,
    };
};

// Ensure address/byte array args have 0x prefix
function normalizeContractCallArgs(contractData: ContractData, functionName: string, args: any[]) {
    for (let i = 0; i < args.length; i++) {
        const functionAbi = contractData.abi.find(
            (item) => item.type === "function" && item.name === functionName,
        ) as AbiFunction | null;
        if (!functionAbi) {
            throw new Error("missing ABI for function: " + functionName);
        }

        const input = functionAbi.inputs[i];
        if (input.type === "address" || input.type === "bytes") {
            if (!args[i].startsWith("0x")) {
                args[i] = `0x${args[i]}`;
            }
        }
    }
}

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

const signTransaction = async <
    T extends { sign: (passphrase: string) => Promise<T>; legacySecondSign: (passphrase: string) => Promise<T> },
>(
    app: Contracts.Kernel.Application,
    builder: T,
    cli: any,
): Promise<T> => {
    let signed = await builder.sign(app.get(AppIdentifiers.WalletPassphrase));

    // if second passphrase is set, sign again
    if (cli.senderSecondPassphrase && cli.senderSecondPassphrase !== "") {
        signed = await signed.legacySecondSign(cli.senderSecondPassphrase);
    }

    return signed;
};
