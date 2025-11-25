import { Contracts, Identifiers } from "@mainsail/contracts";
import { Config } from "../types.js";

import cli from "../../config/config.js";

export const loadConfig = (): Config => cli;

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
    keyPairFactory: Contracts.Crypto.KeyPairFactory;
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

        keyPairFactory: app.getTagged<Contracts.Crypto.KeyPairFactory>(
            Identifiers.Cryptography.Identity.KeyPair.Factory,
            "type",
            "wallet",
        ),
    };
};
