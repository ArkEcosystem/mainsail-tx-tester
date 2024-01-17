import { Contracts } from "@mainsail/contracts";
import cli from "../config/config.json";

export type Peer = typeof cli.peer;

export type Config = {
    crypto: Contracts.Crypto.NetworkConfig;
    cli: typeof cli;
};

export type AddressType = "base58" | "bech32m";

export type ValidatorConfig = {
    secrets: string[];
}

export type Transfer = {
    recipientId: string;
    fee: string;
    amount: string;
    vendorField: string;
};
