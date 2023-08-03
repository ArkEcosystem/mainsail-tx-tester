import { readJSONSync } from "fs-extra";
import { Config } from "./types";
import { join } from "path";

export const loadConfig = (): Config => {
    return {
        crypto: readJSONSync(join(__dirname, "../../mainsail/packages/core/bin/config/testnet/crypto.json")),
        peers: readJSONSync(join(__dirname, "../../mainsail/packages/core/bin/config/testnet/peers.json")),
        genesisWallet: readJSONSync(join(__dirname, "../../mainsail/packages/core/bin/config/testnet/genesis-wallet.json")),
        validators: readJSONSync(join(__dirname, "../../mainsail/packages/core/bin/config/testnet/validators.json")),
    }
};
