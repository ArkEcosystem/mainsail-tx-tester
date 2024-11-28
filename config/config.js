import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };
import contract from "./contract.json" with { type: "json" };
import { consensus } from "./consensus.js";
import { usernames } from "./usernames.js";

const config = {
    senderPassphrase:
        "bullet mean oxygen possible quiz body range ozone quantum elevator inspire cute inject work estate century must this defy siren aisle rich churn explain", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    peer: {
        apiTxPoolUrl: "http://127.0.0.1:4007",
        apiEvmUrl: "http://127.0.0.1:4008",
    },
    contracts: {
        consensus,
        usernames,
    },
    gasPrice: "5",
    crypto: crypto,
    wellKnownContracts: {
        consensus: "0x535B3D7A252fa034Ed71F0C53ec0C6F784cB64E1",
        usernames: "0x2c1DE3b4Dbb4aDebEbB5dcECAe825bE2a9fc6eb6",
        multiPayment: "0x83769BeEB7e5405ef0B7dc3C66C43E3a51A6d27f",
    },
    transfer: {
        recipientAddress: "0xb693449AdDa7EFc015D87944EAE8b7C37EB1690A",
        gasPrice: "5",
        value: "100000000",
    },
    vote: {
        voteAddress: "0xfEAf2f24ba1205e9255d015DFaD8463c70D9A466", // genesis validator
        isUnvote: true,
        gasPrice: "5",
    },
    validatorRegistration: {
        validatorPublicKey:
            "a08058db53e2665c84a40f5152e76dd2b652125a6079130d4c315e728bcf4dd1dfb44ac26e82302331d61977d3141118",
        gasPrice: "5",
    },
    validatorResignation: {
        gasPrice: "5",
    },
    // userNameRegistration: {
    //     username: "simple_tx_tester",
    //     fee: "2500000000",
    // },
    // userNameResignation: {
    //     fee: "2500000000",
    // },
    // multiPayment: {
    //     fee: "10000000",
    //     vendorField: "",
    //     payments: [
    //         {
    //             recipientId: "0xb693449AdDa7EFc015D87944EAE8b7C37EB1690A",
    //             amount: "100000000",
    //         },
    //         {
    //             recipientId: "0xb693449AdDa7EFc015D87944EAE8b7C37EB1690A",
    //             amount: "200000000",
    //         },
    //     ],
    // },
    // Replace as needed
    message: {
        publicKey: "037a62215a2adb6ea17c079262c76e3aa35293b0a575608174505de12de9181110",
        message: "Hello World",
        signature:
            "20dc527c2d85e3b790359d64276b8931e89647d628ab57be99bb7dabfae28932c8a44b7c3fc805b67678b25beed1d481c3df663c17cf9ddc4f5485211fc4baed",
    },
    evmDeploy: {
        data: contract.bytecode,
        gasPrice: "5",
        vendorField: "",
    },
    evmCall: {
        abi: contract.abi,
        gasPrice: "5",
        vendorField: "",
        contractId: "0xE536720791A7DaDBeBdBCD8c8546fb0791a11901",
        functions: [
            {
                functionName: "transfer",
                args: ["0x27FA7CaFFaAE77dDb9AB232FDBDa56D5e5Af2393", "100000000000000000"],
            },
            {
                functionName: "batchTransfer",
                args: [
                    ["0x27FA7CaFFaAE77dDb9AB232FDBDa56D5e5Af2393", "0x27FA7CaFFaAE77dDb9AB232FDBDa56D5e5Af2393"],
                    ["100000000000000000", "200000000000000000"],
                ],
            },
        ],
    },
    evmView: {
        abi: contract.abi,
        contractId: "0xE536720791A7DaDBeBdBCD8c8546fb0791a11901",
        functions: [
            {
                functionName: "balanceOf",
                args: ["0x12361f0Bd5f95C3Ea8BF34af48F5484b811B5CCe"],
            },
            {
                functionName: "allowance",
                args: ["0x2E3DC3fc744F2522239AFf79a3d292B2787ddBf8", "0x27FA7CaFFaAE77dDb9AB232FDBDa56D5e5Af2393"],
            },
            {
                functionName: "totalSupply",
                args: [],
            },
            {
                functionName: "name",
                args: [],
            },
            {
                functionName: "symbol",
                args: [],
            },
            {
                functionName: "decimals",
                args: [],
            },
        ],
    },
    plugins: [
        {
            package: "@mainsail/validation",
        },
        {
            package: "@mainsail/crypto-config",
        },
        {
            package: "@mainsail/crypto-validation",
        },
        {
            package: "@mainsail/crypto-hash-bcrypto",
        },
        {
            package: "@mainsail/crypto-signature-ecdsa",
        },
        {
            package: "@mainsail/crypto-key-pair-ecdsa",
        },
        {
            package: "@mainsail/crypto-address-keccak256",
        },
        {
            package: "@mainsail/crypto-consensus-bls12-381",
        },
        {
            package: "@mainsail/crypto-wif",
        },
        {
            package: "@mainsail/serializer",
        },
        {
            package: "@mainsail/crypto-transaction",
        },
        {
            package: "@mainsail/crypto-transaction-evm-call",
        },
    ],
};

export default config;
