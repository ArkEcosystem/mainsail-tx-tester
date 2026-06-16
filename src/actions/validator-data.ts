import { generateMnemonic, wordlists } from "bip39";
import type { Contracts } from "@mainsail/contracts";
import { makeApplication } from "../boot.js";
import { Identifiers } from "@mainsail/constants";
import { buildProofOfPossession } from "@mainsail/crypto-key-pair-bls12-381";
import { bytesToHex } from "viem";
import { makeIdentityFactories } from "./utils.js";

const generateBlsKeysPerLocale = async (
    keyPairFactory: Contracts.Crypto.KeyPairFactory,
): Promise<void> => {
    const result: Record<string, object[]> = {};

    // EN and JA are aliases for english and japanese — skip to avoid duplicate entries
    const aliases = new Set(["EN", "JA"]);

    for (const [locale, wordlist] of Object.entries(wordlists)) {
        if (aliases.has(locale)) continue;

        result[locale] = [];

        for (let i = 0; i < 5; i++) {
            const mnemonic = generateMnemonic(256, undefined, wordlist);

            const keyPair = await keyPairFactory.fromMnemonic(mnemonic);
            const { pk, pop } = buildProofOfPossession(Buffer.from(keyPair.privateKey, "hex"));

            const validatorPublicKey = bytesToHex(pk);
            const validatorPop = bytesToHex(pop);

            result[locale].push([mnemonic, keyPair.privateKey, validatorPublicKey, validatorPop]);
        }
    }

    console.log(JSON.stringify(result, null, 4));
};

const main = async () => {
    const app = await makeApplication();

    const keyPairFactory = app.getTagged<Contracts.Crypto.KeyPairFactory>(
        Identifiers.Cryptography.Identity.KeyPair.Factory,
        "type",
        "consensus",
    );

    if (process.argv.includes("--locales")) {
        await generateBlsKeysPerLocale(keyPairFactory);
        return;
    }

    const { consensusPrivateKeyFactory, consensusPublicKeyFactory } = makeIdentityFactories(app);

    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    console.log("Mnemonic: ", mnemonic);
    console.log();
    console.log("Validator Public Key: ", await consensusPublicKeyFactory.fromMnemonic(mnemonic));
    console.log("Validator Private Key: ", await consensusPrivateKeyFactory.fromMnemonic(mnemonic));
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
