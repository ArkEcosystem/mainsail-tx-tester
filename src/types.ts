import { Contracts } from "@mainsail/contracts";
import cli from "../config/config.js";

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

export type Contract = {
    abi: object;
    contractId: string;
    views: { functionName: string; args: any[] }[];
};
