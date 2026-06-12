import { generateMnemonic, wordlists } from "bip39";
import type { Contracts } from "@mainsail/contracts";
import { makeApplication } from "../boot.js";
import { makeIdentityFactories } from "./utils.js";

const generateBlsKeysPerLocale = async (
    consensusPublicKeyFactory: Contracts.Crypto.PublicKeyFactory,
    consensusPrivateKeyFactory: Contracts.Crypto.PrivateKeyFactory,
    consensusSignatureFactory: Contracts.Crypto.Signature,
): Promise<void> => {
    const result: Record<string, object[]> = {};

    // EN and JA are aliases for english and japanese — skip to avoid duplicate entries
    const aliases = new Set(["EN", "JA"]);

    for (const [locale, wordlist] of Object.entries(wordlists)) {
        if (aliases.has(locale)) continue;

        result[locale] = [];

        for (let i = 0; i < 5; i++) {
            const mnemonic = generateMnemonic(256, undefined, wordlist);
            const publicKey = await consensusPublicKeyFactory.fromMnemonic(mnemonic);
            const privateKey = await consensusPrivateKeyFactory.fromMnemonic(mnemonic);
            const proofOfPossession = await consensusSignatureFactory.sign(
                Buffer.from(publicKey, "hex"),
                Buffer.from(privateKey, "hex"),
            );

            result[locale].push({mnemonic, privateKey, publicKey, proofOfPossession});
        }
    }

    console.log(JSON.stringify(result, null, 4));
};

const main = async () => {
    const app = await makeApplication();
    const { consensusPrivateKeyFactory, consensusPublicKeyFactory, consensusSignatureFactory } =
        makeIdentityFactories(app);

    if (process.argv.includes("--locales")) {
        await generateBlsKeysPerLocale(consensusPublicKeyFactory, consensusPrivateKeyFactory, consensusSignatureFactory);
        return;
    }

    const mnemonic = process.argv.length === 3 ? process.argv[2] : generateMnemonic(256);

    console.log("Mnemonic: ", mnemonic);
    console.log();
    console.log("Validator Public Key: ", await consensusPublicKeyFactory.fromMnemonic(mnemonic));
    console.log("Validator Private Key: ", await consensusPrivateKeyFactory.fromMnemonic(mnemonic));
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
