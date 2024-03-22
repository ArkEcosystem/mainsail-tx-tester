import { Container } from "@mainsail/container";
import { Identifiers, Contracts } from "@mainsail/contracts";
import { Application, Providers } from "@mainsail/kernel";
import { Config } from "./types.js";

export const getApplication = async (config: Config): Promise<Application> => {
    const app = new Application(new Container());

    const plugins = config.cli.plugins;
    for (const plugin of plugins) {
        const packageModule = plugin.package;
        const { ServiceProvider } = await import(packageModule);
        const serviceProvider: Providers.ServiceProvider = app.resolve(ServiceProvider);
        await serviceProvider.register();
    }

    app.get<Contracts.Crypto.Configuration>(Identifiers.Cryptography.Configuration).setConfig(config.crypto);

    return app;
};
