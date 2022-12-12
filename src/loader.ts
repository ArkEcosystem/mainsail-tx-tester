import { readJSONSync } from "fs-extra";
import { Config } from "./types";
import { join } from "path";

export const loadConfig = (): Config => {
    return readJSONSync(join(__dirname, "../config/config.json"));
};

export const loadCryptoConfig = (): any => {
    return {
        exceptions: readJSONSync(join(__dirname, "../config/crypto/exceptions.json")),
        genesisBlock: readJSONSync(join(__dirname, "../config/crypto/genesisBlock.json")),
        milestones: readJSONSync(join(__dirname, "../config/crypto/milestones.json")),
        network: readJSONSync(join(__dirname, "../config/crypto/network.json")),
    };
};
