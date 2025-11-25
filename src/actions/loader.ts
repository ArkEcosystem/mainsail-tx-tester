import { Config } from "../types.js";

import cli from "../../config/config.js";

export const loadConfig = (): Config => cli;
