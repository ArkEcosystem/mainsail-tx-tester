import { Container } from "@mainsail/container";
import { Identifiers, Contracts } from "@mainsail/contracts";
import { Application, Providers } from "@mainsail/kernel";
import { Config } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";

let app: Application | undefined = undefined;

export const getApplication = (): Application => {
    if (!app) {
        throw new Error("Application not initialized");
    }

    return app;
};

export const makeApplication = async (config: Config): Promise<Application> => {
    if (app) {
        return app;
    }

    app = new Application(new Container());

    const plugins = [
        {
            package: "@mainsail/validation",
        },
        {
            package: "@mainsail/crypto-config",
        },
        {
            package: "@mainsail/crypto-validation",
        },
        {
            package: "@mainsail/crypto-hash-bcrypto",
        },
        {
            package: "@mainsail/crypto-signature-ecdsa",
        },
        {
            package: "@mainsail/crypto-key-pair-ecdsa",
        },
        {
            package: "@mainsail/crypto-address-keccak256",
        },
        {
            package: "@mainsail/crypto-consensus-bls12-381",
        },
        {
            package: "@mainsail/crypto-wif",
        },
        {
            package: "@mainsail/serializer",
        },
        {
            package: "@mainsail/crypto-transaction",
        },
    ];

    for (const plugin of plugins) {
        try {
            const { ServiceProvider } = await import(plugin.package);
            const serviceProvider: Providers.ServiceProvider = app.resolve(ServiceProvider);
            await serviceProvider.register();
        } catch (error) {
            if (plugin.package !== "@mainsail/crypto-config") {
                console.log(`Failed to register plugin ${plugin.package}`);
                throw error;
            }
        }
    }

    app.get<Contracts.Crypto.Configuration>(Identifiers.Cryptography.Configuration).setConfig(config.crypto);

    // APP
    app.bind(AppIdentifiers.WalletPassphrase).toConstantValue(config.cli.senderPassphrase);

    return app;
};
