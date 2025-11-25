import { Contracts } from "@mainsail/contracts";
import { Abi } from "viem";

export interface Client {
    getWalletNonce: (peer: Peer, address: string) => Promise<number>;
    getHeight: (peer: Peer) => Promise<number>;
    ethCall: (peer: Peer, viewParameters: EthViewParameters) => Promise<string>;
    postTransaction: (peer: Peer, transaction: string) => Promise<string>;
    getReceipt: (peer: Peer, transaction: string) => Promise<Receipt | null>;
}

export interface TransferBuilder {
    makeTransfer: (config: Config, recipient?: string, amount?: string) => Promise<Contracts.Crypto.Transaction>;
}
export interface ContractBuilder {
    makeDeploy: (contractData: ContractData) => Promise<Contracts.Crypto.Transaction>;
    makeCall: (
        contractData: ContractData,
        functionIndex: number,
        args?: any[],
        amount?: string,
    ) => Promise<Contracts.Crypto.Transaction>;
}

export interface ViewBuilder {
    makeView: (contractData: ContractData, index: number) => Promise<EthViewParameters>;
}

export type Peer = string;

export type Config = {
    privateKey: string;
    senderPassphrase: string;
    senderSecondPassphrase: string;
    peer: string;
    gasPrice: number;
    transfer: {
        recipientAddress: string;
        value: string;
    };
    contracts: Record<string, ContractData>;
    message: {
        publicKey: string;
        message: string;
        signature: string;
    };
    crypto: Contracts.Crypto.NetworkConfig;
};

export type ContractData = {
    abi: Abi;
    name: string;
    contractId: string;
    bytecode: string;
    transactions: { functionName: string; args: any[]; amount?: number }[];
    views: { functionName: string; args: any[] }[];
};

export interface Contract {
    list: () => void;
    interact: (transactionIndex: number, args?: any, amount?: string) => Promise<string | void>;
}

export type ContractFactory = (data: ContractData) => Contract;

export interface Wallet {
    getAddress: () => Promise<string>;
    getNonce: () => Promise<number>;
    getKeyPair: () => Promise<Contracts.Crypto.KeyPair>;
    hasSecondPassphrase: () => boolean;
    getSecondPassphrase: () => string;
}

export type AddressType = "base58" | "bech32m";

export type ValidatorConfig = {
    secrets: string[];
};

export type Transfer = {
    recipientAddress: string;
    gasPrice: string;
    value: string;
};

export type EthViewParameters = {
    from?: string;
    to: string;
    data: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
};

export type ArgsAndFlags = {
    args: string[];
    flags: Record<string, string>;
};

export type Receipt = {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    from: string;
    to?: string;
    cumulativeGasUsed: string;
    effectiveGasUsed: string;
    gasUsed: string;
    logs: any[];
    logsBloom: string;
    type: string;
    status: string;
};
