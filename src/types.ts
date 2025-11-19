import { Contracts } from "@mainsail/contracts";
import cli from "../config/config.js";
import { Abi } from "viem";

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
    from: string;
    to: string;
    data: string;
};

export type ContractData = {
    abi: Abi;
    name: string;
    contractId: string;
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
