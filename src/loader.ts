import { readJSONSync } from "fs-extra";
import { Config } from "./types";
import { join } from "path";

import cli from "../config/config.json";

export const loadConfig = (): Config => {
    return {
        crypto: readJSONSync(join(__dirname, cli.cryptoJsonPath)),
        cli,
    }
};
