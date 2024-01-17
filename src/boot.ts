import { Container } from "@mainsail/container";
import { Identifiers, Contracts } from "@mainsail/contracts";
import { Application, } from "@mainsail/kernel";

import { ServiceProvider as CoreCryptoAddressBase58 } from "@mainsail/crypto-address-base58";
import { ServiceProvider as CoreCryptoAddressBech32m } from "@mainsail/crypto-address-bech32m";
import { ServiceProvider as CoreCryptoConfig } from "@mainsail/crypto-config";
import { ServiceProvider as CoreCryptoHashBcrypto } from "@mainsail/crypto-hash-bcrypto";
import { ServiceProvider as CoreCryptoKeyPairSchnorr } from "@mainsail/crypto-key-pair-schnorr";
import { ServiceProvider as CoreCryptoSignatureSchnorr } from "@mainsail/crypto-signature-schnorr";
// import { ServiceProvider as CoreCryptoKeyPairSchnorr } from "@mainsail/crypto-key-pair-ecdsa";
// import { ServiceProvider as CoreCryptoSignatureSchnorr } from "@mainsail/crypto-signature-schnorr-legacy";
import { ServiceProvider as CoreCryptoTransaction } from "@mainsail/crypto-transaction";
import { ServiceProvider as CoreCryptoTransactionTransfer } from "@mainsail/crypto-transaction-transfer";
import { ServiceProvider as CoreCryptoTransactionValidatorRegistration } from "@mainsail/crypto-transaction-validator-registration";
import { ServiceProvider as CoreCryptoTransactionMultiPayment } from "@mainsail/crypto-transaction-multi-payment";
import { ServiceProvider as CoreCryptoTransactionVote } from "@mainsail/crypto-transaction-vote";
import { ServiceProvider as CoreCryptoValidation } from "@mainsail/crypto-validation";
import { ServiceProvider as CoreCryptoWif } from "@mainsail/crypto-wif";
import { ServiceProvider as CoreFees } from "@mainsail/fees";
import { ServiceProvider as CoreFeesStatic } from "@mainsail/fees-static";
import { ServiceProvider as CoreSerializer } from "@mainsail/serializer";
import { ServiceProvider as CoreValidation } from "@mainsail/validation";
import { AddressType, Config } from "./types";

export const getApplication = async (config: Config): Promise<Application> => {
    const app = new Application(new Container());

    await app.resolve(CoreSerializer).register();
    await app.resolve(CoreValidation).register();
    await app.resolve(CoreCryptoConfig).register();
    await app.resolve(CoreCryptoValidation).register();
    await app.resolve(CoreCryptoHashBcrypto).register();
    await app.resolve(CoreCryptoSignatureSchnorr).register();
    await app.resolve(CoreCryptoKeyPairSchnorr).register();

    const addressType = detectAddressType(config);
    switch (addressType) {
        case "base58": {
            await app.resolve(CoreCryptoAddressBase58).register();
            break;
        }
        case "bech32m": {
            await app.resolve(CoreCryptoAddressBech32m).register();
            break;
        }
    }

    await app.resolve(CoreCryptoWif).register();
    await app.resolve(CoreFees).register();
    await app.resolve(CoreFeesStatic).register();
    await app.resolve(CoreCryptoTransaction).register();
    await app.resolve(CoreCryptoTransactionValidatorRegistration).register();
    await app.resolve(CoreCryptoTransactionTransfer).register();
    await app.resolve(CoreCryptoTransactionVote).register();
    await app.resolve(CoreCryptoTransactionMultiPayment).register();

    app.get<Contracts.Crypto.Configuration>(Identifiers.Cryptography.Configuration).setConfig(config.crypto);

    return app;
};

const detectAddressType = (config: Config): AddressType => {
    const milestone = config.crypto.milestones[0];

    if ("base58" in milestone.address) {
        return "base58";
    }

    if ("bech32m" in milestone.address) {
        return "bech32m";
    }

    throw new Error("unsupported:" + JSON.stringify(milestone.address));
}