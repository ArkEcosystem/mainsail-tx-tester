import { Config } from "./types";

import cli from "../config/config.js";

export const loadConfig = (): Config => {
    return {
        crypto: cli.crypto,
        cli,
    };
};
