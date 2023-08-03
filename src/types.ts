import { Contracts } from "../../mainsail/packages/contracts";
import { Contracts as ConfigurationContracts } from "../../mainsail/packages/configuration-generator";

export type Config = {
    genesisWallet: ConfigurationContracts.Wallet;
    crypto: Contracts.Crypto.NetworkConfig;
    peers: PeerConfig;
    validators: ValidatorConfig;
};

export type PeerConfig = {
    list: Peer[];
}

export type Peer = {
    ip: string;
    port: number;
    protocol?: string;
};

export type ValidatorConfig = {
    secrets: string[];
}

export type Transfer = {
    recipientId: string;
    fee: string;
    amount: string;
    vendorField: string;
};
