import { getApplication } from "./boot";
import { loadConfig } from "./loader";
import { Contracts, Identifiers } from "@mainsail/contracts";

const main = async () => {
    if (process.argv.length !== 3) {
        console.log("Please provide a wallet mnemonic as first argument");
        return;
    }

    const mnemonic = process.argv[2];

    console.log("Mnemonic: ", mnemonic);

    const app = await getApplication(loadConfig());

    const { publicKeyFactory, addressFactory } = makeIdentityFactories(app);

    console.log("Public Key: ", await publicKeyFactory.fromMnemonic(mnemonic));
    console.log("Address: ", await addressFactory.fromMnemonic(mnemonic));
};

const makeIdentityFactories = (
    app: Contracts.Kernel.Application,
): {
    addressFactory: Contracts.Crypto.AddressFactory;
    publicKeyFactory: Contracts.Crypto.PublicKeyFactory;
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
    };
};

main();
