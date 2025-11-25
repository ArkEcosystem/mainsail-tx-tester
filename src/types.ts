import { Contracts } from "@mainsail/contracts";
import cli from "../config/config.js";
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

export type Peer = typeof cli.peer;

export type Config = {
    crypto: Contracts.Crypto.NetworkConfig;
    cli: typeof cli;
};

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

export type ContractData = {
    abi: Abi;
    name: string;
    contractId: string;
    bytecode: string;
    transactions: { functionName: string; args: any[]; amount?: number }[];
    views: { functionName: string; args: any[] }[];
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
