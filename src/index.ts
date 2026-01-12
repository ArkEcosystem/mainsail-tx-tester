import { makeApplication } from "./boot.js";
import { Cli } from "./cli.js";

if (import.meta.url === `file://${process.argv[1]}`) {
    const app = await makeApplication();
    await app.resolve(Cli).run();
}
