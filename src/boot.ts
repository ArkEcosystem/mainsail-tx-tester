import { Container } from "../../mainsail/packages/container/distribution";
import { Identifiers, Contracts } from "../../mainsail/packages/contracts/distribution";
import { Application, } from "../../mainsail/packages/kernel/distribution";

import { ServiceProvider as CoreCryptoAddressBase58 } from "../../mainsail/packages/crypto-address-base58";
import { ServiceProvider as CoreCryptoAddressBech32m } from "../../mainsail/packages/crypto-address-bech32m";
import { ServiceProvider as CoreCryptoConfig } from "../../mainsail/packages/crypto-config";
import { ServiceProvider as CoreCryptoHashBcrypto } from "../../mainsail/packages/crypto-hash-bcrypto";
import { ServiceProvider as CoreCryptoKeyPairSchnorr } from "../../mainsail/packages/crypto-key-pair-schnorr";
import { ServiceProvider as CoreCryptoSignatureSchnorr } from "../../mainsail/packages/crypto-signature-schnorr";
import { ServiceProvider as CoreCryptoTransaction } from "../../mainsail/packages/crypto-transaction";
import { ServiceProvider as CoreCryptoTransactionTransfer } from "../../mainsail/packages/crypto-transaction-transfer";
import { ServiceProvider as CoreCryptoTransactionValidatorRegistration } from "../../mainsail/packages/crypto-transaction-validator-registration";
import { ServiceProvider as CoreCryptoTransactionVote } from "../../mainsail/packages/crypto-transaction-vote";
import { ServiceProvider as CoreCryptoValidation } from "../../mainsail/packages/crypto-validation";
import { ServiceProvider as CoreCryptoWif } from "../../mainsail/packages/crypto-wif";
import { ServiceProvider as CoreFees } from "../../mainsail/packages/fees";
import { ServiceProvider as CoreFeesStatic } from "../../mainsail/packages/fees-static";
import { ServiceProvider as CoreSerializer } from "../../mainsail/packages/serializer";
import { ServiceProvider as CoreValidation } from "../../mainsail/packages/validation";
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
        case "bech32": {
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

    app.get<Contracts.Crypto.IConfiguration>(Identifiers.Cryptography.Configuration).setConfig(config.crypto);

    app.bind(Identifiers.Application).toConstantValue(app);

    return app;
};

const detectAddressType = (config: Config): AddressType => {
    const milestone = config.crypto.milestones[0];

    if ("base58" in milestone.address) {
        return "base58";
    }

    if ("bech32" in milestone.address) {
        return "bech32";
    }

    throw new Error("unsupported:" + JSON.stringify(milestone.address));
}