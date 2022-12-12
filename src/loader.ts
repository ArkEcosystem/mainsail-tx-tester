import { readJSONSync } from "fs-extra";
import { Config } from "./types";
import { join } from "path";

export const loadConfig = (): Config => {
    return readJSONSync(join(__dirname, "../config/config.json"));
};
