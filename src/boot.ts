import { Container } from "@mainsail/container";
import { Identifiers, Contracts } from "@mainsail/contracts";
import { Application, Providers } from "@mainsail/kernel";
import { AppIdentifiers } from "./identifiers.js";
import { Client } from "./client.js";
import { ContractData, ContractHandlerFactory, Flags } from "./types.js";
import { ContractHandler, TransactionHandler } from "./handler/index.js";
import { Logger } from "./logger.js";
import { Wallet } from "./wallet.js";
import { TransferBuilder, ContractBuilder, ViewBuilder } from "./builders/index.js";
import config from "../config/config.js";

let app: Application | undefined = undefined;

export const getApplication = (): Application => {
    if (!app) {
        throw new Error("Application not initialized");
    }

    return app;
};

export const makeApplication = async (): Promise<Application> => {
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

    app.bind(AppIdentifiers.Config).toConstantValue(config);
    app.get<Contracts.Crypto.Configuration>(Identifiers.Cryptography.Configuration).setConfig(config.crypto);

    // APP
    app.bind(AppIdentifiers.Logger).to(Logger).inSingletonScope();
    app.bind(AppIdentifiers.Client).to(Client).inSingletonScope();
    app.bind(AppIdentifiers.Wallet).to(Wallet).inSingletonScope();
    app.bind(AppIdentifiers.TransactionHandler).to(TransactionHandler).inSingletonScope();
    app.bind(AppIdentifiers.TransferBuilder).to(TransferBuilder).inSingletonScope();
    app.bind(AppIdentifiers.ContractBuilder).to(ContractBuilder).inSingletonScope();
    app.bind(AppIdentifiers.ViewBuilder).to(ViewBuilder).inSingletonScope();

    app.bind<ContractHandlerFactory>(AppIdentifiers.ContractHandlerFactory).toFactory(
        (context: Contracts.Kernel.Container.ResolutionContext) =>
            (contractData: ContractData, flags: Flags): ContractHandler =>
                context.get(ContractHandler, { autobind: true }).init(contractData, flags),
    );

    return app;
};
