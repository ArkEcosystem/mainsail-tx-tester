import crypto from "@mainsail/core/bin/config/testnet/core/crypto.json" with { type: "json" };
import contract from "./contract.json" with { type: "json" };

const config = {
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    peer: {
        apiUrl: "https://dwallets-evm.mainsailhq.com",
        apiTxPoolUrl: "https://dwallets-evm.mainsailhq.com/tx",
        apiEvmUrl: "https://dwallets-evm.mainsailhq.com/evm",
    },
    crypto: crypto,
    wellKnownContracts: {
        consensus: "0x522B3294E6d06aA25Ad0f1B8891242E335D3B459",
    },
    transfer: {
        recipientAddress: "0xb693449AdDa7EFc015D87944EAE8b7C37EB1690A",
        gasPrice: "5",
        value: "100000000",
    },
    vote: {
        voteAddress: "0x512F366D524157BcF734546eB29a6d687B762255",
        unvoteAsset: "",
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
    // validatorRegistration: {
    //     validatorPublicKey:
    //         "a08058db53e2665c84a40f5152e76dd2b652125a6079130d4c315e728bcf4dd1dfb44ac26e82302331d61977d3141118",
    //     fee: "2500000000",
    // },
    // validatorResignation: {
    //     fee: "2500000000",
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
        fee: "5",
        vendorField: "",
    },
    evmCall: {
        abi: contract.abi,
        fee: "5",
        vendorField: "",
        contractId: "0xfAcdC93a03a5ecAb6a2148a72C277F69aa2f37C9",
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
        contractId: "0xfAcdC93a03a5ecAb6a2148a72C277F69aa2f37C9",
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
            package: "@mainsail/crypto-signature-schnorr",
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
