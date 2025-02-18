import { getApplication, makeApplication } from "../boot.js";

import { EvmCallBuilder } from "@mainsail/crypto-transaction-evm-call";
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

interface TransferData {
    data: {
        network: number;
        nonce: string;
        gasPrice: number;
        gasLimit: number;
        recipientAddress: string;
        value: string;
        data: string;
        v: number;
        r: string;
        s: string;
        senderPublicKey: string;
        senderAddress: string;
        id: string;
    };
    serialized: string;
}

/////

const writeToJson = async (filename: string, data: any) => {
    const dataDir = join(process.cwd(), "data");
    try {
        writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            const { mkdirSync } = await import("fs");
            mkdirSync(dataDir, { recursive: true });
            writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2));
        } else {
            throw error;
        }
    }
};

const writeIdentityToJson = (identity: Identity) => writeToJson("identity.json", identity);
const writeTransferToJson = (transfer: TransferData) => writeToJson("transfer.json", transfer);

////////

const main = async () => {
    const DEFAULT_MNEMONIC =
        "found lobster oblige describe ready addict body brave live vacuum display salute lizard combine gift resemble race senior quality reunion proud tell adjust angle";
    const mnemonic = process.argv.length === 3 ? process.argv[2] : DEFAULT_MNEMONIC;

    await makeApplication(loadConfig());

    generateIdentity(mnemonic);
    generateTransfers(mnemonic);
};

const generateIdentity = async (mnemonic: string) => {
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
    };

    // try/catch here as consensus factories cannot handle non-standard mnemonics
    try {
        identity.data.validatorPublicKey = await consensusPublicKeyFactory.fromMnemonic(mnemonic);
        identity.data.validatorPrivateKey = await consensusPrivateKeyFactory.fromMnemonic(mnemonic);
    } catch (error) {
        //
    }

    // Write identity to JSON file
    await writeIdentityToJson(identity);
    console.log("\nIdentity data written to data/identity.json");
};

const generateTransfers = async (mnemonic: string) => {
    const app = getApplication();

    const signed = await app
        .resolve(EvmCallBuilder)
        .gasPrice(5000000000)
        .gasLimit(21000)
        .nonce("1")
        .recipientAddress("0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22")
        .value("100000000")
        .payload("")
        .sign(mnemonic);

    const builtTransaction = await signed.build();

    const transferData = {
        data: Object.fromEntries(
            Object.entries(builtTransaction.data).map(([key, value]) => [
                key,
                // Convert BigNumber objects to strings, keep other values as is
                value && typeof value === "object" && "toString" in value ? value.toString() : value,
            ]),
        ),
        serialized: builtTransaction.serialized.toString("hex"),
    };

    // @ts-ignore
    await writeTransferToJson(transferData);
    console.log("Transfer data written to data/transfer.json");
};

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
