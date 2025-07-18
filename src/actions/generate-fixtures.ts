import { encodeFunctionData } from "viem";
import { SigningKey, hashMessage } from "ethers";
import { getApplication, makeApplication } from "../boot.js";

import { EvmCallBuilder } from "@mainsail/crypto-transaction-evm-call";
import fixtureConfig from "../../config/fixtures.js";
import { join } from "path";
import { loadConfig } from "../loader.js";
import { makeIdentityFactories } from "../builder.js";
import { writeFileSync } from "fs";

interface Identity {
    data: {
        publicKey: string;
        privateKey: string;
        address: string;
        wif: string;
        validatorPublicKey?: string;
        validatorPrivateKey?: string;
    };
    passphrase: string;
}

const writeFixtureToFile = async (filename: string, data: any) => {
    const dataDir = join(process.cwd(), "data");

    if (data['data'] && typeof data['data']['gasPrice'] !== 'undefined') {
        data['data']['gasPrice'] = data['data']['gasPrice'].toString();
    }

    if (data['data'] && typeof data['data']['gasLimit'] !== 'undefined') {
        data['data']['gasLimit'] = data['data']['gasLimit'].toString();
    }

    try {
        writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 4));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            const { mkdirSync } = await import("fs");
            mkdirSync(dataDir, { recursive: true });
            writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 4));
        } else {
            throw error;
        }
    }
};

const main = async () => {
    const DEFAULT_MNEMONIC = fixtureConfig["passphrase"];
    const mnemonic = process.argv.length === 3 ? process.argv[2] : DEFAULT_MNEMONIC;
    const secondMnemonic = fixtureConfig["secondPassphrase"] || undefined;

    await makeApplication(loadConfig());

    await generateIdentity(mnemonic, secondMnemonic);
    await generateTransactions(mnemonic, secondMnemonic);
    await generateMessageSign(mnemonic);
};

const generateIdentity = async (mnemonic: string, secondMnemonic?: string) => {
    const app = getApplication();

    const {
        publicKeyFactory,
        privateKeyFactory,
        addressFactory,
        consensusPrivateKeyFactory,
        consensusPublicKeyFactory,
        wifFactory,
    } = makeIdentityFactories(app);

    const identity: Identity = {
        data: {
            publicKey: await publicKeyFactory.fromMnemonic(mnemonic),
            privateKey: await privateKeyFactory.fromMnemonic(mnemonic),
            address: await addressFactory.fromMnemonic(mnemonic),
            wif: await wifFactory.fromMnemonic(mnemonic),
        },
        passphrase: mnemonic,
        ...(secondMnemonic ? { secondPassphrase: secondMnemonic } : {}),
    };

    // try/catch here as consensus factories cannot handle non-standard mnemonics
    try {
        identity.data.validatorPublicKey = await consensusPublicKeyFactory.fromMnemonic(mnemonic);
        identity.data.validatorPrivateKey = await consensusPrivateKeyFactory.fromMnemonic(mnemonic);
    } catch (error) {
        //
    }

    await writeFixtureToFile("identity.json", identity);
    console.log("\nIdentity data written to data/identity.json");
};

const getTransactionData = (builtTransaction: object) => {
    return {
        data: Object.fromEntries(
            Object.entries(builtTransaction["data"]).map(([key, value]) => [
                key,
                // Convert BigNumber objects to strings, keep other values as is
                value && typeof value === "object" && "toString" in value ? value.toString() : value,
            ]),
        ),
        serialized: builtTransaction["serialized"].toString("hex"),
    };
};

const generateTransfer = async (mnemonic: string, fixtureName: string, config: object, secondMnemonic?: string) => {
    const app = getApplication();

    const transaction = app
        .resolve(EvmCallBuilder)
        .gasPrice(config["gasPrice"] || 5000000000)
        .gasLimit(config["gasLimit"] || 21000)
        .nonce(config["nonce"] || "1")
        .value(config["value"] || "0")
        .payload("");

    if (config["recipientAddress"]) {
        transaction.recipientAddress(config["recipientAddress"]);
    }

    const signed = await signTransaction(transaction, mnemonic, secondMnemonic);

    const builtTransaction = await signed.build();

    await writeFixtureToFile(`${fixtureName}.json`, getTransactionData(builtTransaction));
    console.log(`Transfer data written to data/${fixtureName}.json`);
};

const generateTransaction = async (mnemonic: string, fixtureName: string, config: object, secondMnemonic?: string) => {
    const contract = config["contract"];
    const args = contract["args"];
    const functionName = contract["functionName"];

    const app = getApplication();

    const data = encodeFunctionData({
        abi: contract["data"].abi,
        functionName,
        args,
    });

    let builder = app
        .resolve(EvmCallBuilder)
        .gasPrice(config["gasPrice"] || 5000000000)
        .gasLimit(config["gasLimit"] || 21000)
        .nonce(config["nonce"] || "1")
        .payload(data.slice(2))
        .recipientAddress(config["recipientAddress"] || contract["data"].contractId)
        .value(config["value"] || "0");

    const signed = await signTransaction(builder, mnemonic, secondMnemonic);

    const builtTransaction = await signed.build();

    await writeFixtureToFile(`${fixtureName}.json`, getTransactionData(builtTransaction));
    console.log(`Transaction data written to data/${fixtureName}.json`);
};

const generateTransactions = async (mnemonic: string, defaultSecondMnemonic?: string) => {
    for (const fixtureName of Object.keys(fixtureConfig)) {
        const fixture = fixtureConfig[fixtureName];

        if (! fixture || typeof fixture !== "object") {
            continue;
        }

        const secondMnemonic = fixture["secondPassphrase"] || defaultSecondMnemonic;
        if (fixture && typeof fixture === "object" && "contract" in fixture) {
            await generateTransaction(mnemonic, fixtureName, fixture, secondMnemonic);

            continue;
        }

        await generateTransfer(mnemonic, fixtureName, fixture, secondMnemonic);
    }
};

const generateMessageSign = async (mnemonic: string) => {
    const app = getApplication();

    const { privateKeyFactory, publicKeyFactory } = makeIdentityFactories(app);

    const message = "Hello, world!";
    const privateKey = await privateKeyFactory.fromMnemonic(mnemonic);
    const publicKey = await publicKeyFactory.fromMnemonic(mnemonic);
    const signature = new SigningKey(`0x${privateKey}`).sign(hashMessage(message))

    await writeFixtureToFile("message-sign.json", {
        message,
        publicKey,
        signature: signature.serialized
    });
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

const signTransaction = async <
    T extends { sign: (passphrase: string) => Promise<T>; legacySecondSign: (passphrase: string) => Promise<T> },
>(
    builder: T,
    mnemonic: string,
    secondMnemonic?: string,
): Promise<T> => {
    let signed = await builder.sign(mnemonic);

    // if second passphrase is set, sign again
    if (secondMnemonic && secondMnemonic !== "") {
        signed = await signed.legacySecondSign(secondMnemonic);
    }

    return signed;
};
