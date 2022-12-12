import { loadConfig, loadCryptoConfig } from "./loader";

const config = loadConfig();

console.log(config);
console.log(loadCryptoConfig());
