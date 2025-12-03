import { Contracts } from "@mainsail/contracts";
import { Abi } from "viem";

export interface Logger {
    line: () => void;
    header: (title: string) => void;
    logKV: (key: string, value: string) => void;
    log: (message: string) => void;
}

export type JSONRPCResultSuccess<T> = {
    success: true;
    result: T;
};

export type JSONRPCResultError = {
    success: false;
    code: number;
    message: string;
    data?: string;
};

export type JSONRPCResponse<T> = JSONRPCResultSuccess<T> | JSONRPCResultError;

export interface Client {
    getWalletNonce: (address: string) => Promise<number>;
    getHeight: () => Promise<number>;
    ethEstimateGas: (viewParameters: EthViewParameters) => Promise<JSONRPCResponse<string>>;
    ethCall: (viewParameters: EthViewParameters) => Promise<JSONRPCResponse<string>>;
    postTransaction: (transaction: string) => Promise<JSONRPCResponse<string>>;
    getReceipt: (transaction: string) => Promise<JSONRPCResponse<Receipt | null>>;
}

export interface TransactionSender {
    sendTransaction: (tx: Contracts.Crypto.Transaction) => Promise<void>;
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
    decodeViewResult: (contractData: ContractData, index: number, data: any) => void;
    decodeViewError: (contractData: ContractData, data: any) => void;
}

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
    waitForBlock: boolean;
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

export type ContractFactory = (data: ContractData, flags: Flags) => Contract;

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

export type EthViewParameters = {
    from?: string;
    to: string;
    data: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
};

export type Args = string[];
export type Flags = Record<string, string>;
export type ArgsAndFlags = {
    args: Args;
    flags: Flags;
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
