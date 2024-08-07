import crypto from "mainsail-network-config/testnet/mainsail/crypto.json" assert { type: "json" };

const config = {
    senderPassphrase: "", // REPLACE senderPassphrase WITH THE PASSPHRASE OF YOUR WALLET
    peer: {
        apiUrl: "https://dwallets.mainsailhq.com",
        apiTxPoolUrl: "https://dwallets.mainsailhq.com/tx",
    },
    crypto: crypto,
    transfer: {
        recipientId: "DNvqMC1YBF76AoT1emyqVGHyfwNw31RCws",
        fee: "10000000",
        amount: "1",
        vendorField: "",
    },
    vote: {
        voteAsset: "03f25455408f9a7e6c6a056b121e68fbda98f3511d22e9ef27b0ebaf1ef9e4eabc",
        unvoteAsset: "",
        fee: "100000000",
    },
    userNameRegistration: {
        username: "simple_tx_tester",
        fee: "2500000000",
    },
    userNameResignation: {
        fee: "2500000000",
    },
    multiPayment: {
        fee: "10000000",
        vendorField: "",
        payments: [
            {
                recipientId: "DNvqMC1YBF76AoT1emyqVGHyfwNw31RCws",
                amount: "100000000",
            },
            {
                recipientId: "DCFP8KogR2Jq34JuH6SdUpHjMPzLm3hpaC",
                amount: "200000000",
            },
        ],
    },
    multiSignatureRegistration: {
        min: 2,
        participants: [
            "album pony urban cheap small blade cannon silent run reveal luxury glad predict excess fire beauty hollow reward solar egg exclude leaf sight degree",
            "hen slogan retire boss upset blame rocket slender area arch broom bring elder few milk bounce execute page evoke once inmate pear marine deliver",
            "top visa use bacon sun infant shrimp eye bridge fantasy chair sadness stable simple salad canoe raw hill target connect avoid promote spider category",
        ],
        fee: "500000000",
    },
    validatorRegistration: {
        validatorPublicKey:
            "a08058db53e2665c84a40f5152e76dd2b652125a6079130d4c315e728bcf4dd1dfb44ac26e82302331d61977d3141118",
        fee: "2500000000",
    },
    validatorResignation: {
        fee: "2500000000",
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
            __comment__: "replace as needed for ARK network compat",
            package: "@mainsail/crypto-signature-schnorr-secp256k1",
        },
        {
            __comment__: "replace as needed for ARK network compat",
            package: "@mainsail/crypto-key-pair-ecdsa",
        },
        {
            __comment__: "replace as needed for ARK network compat",
            package: "@mainsail/crypto-address-base58",
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
            package: "@mainsail/fees",
        },
        {
            package: "@mainsail/fees-static",
        },
        {
            package: "@mainsail/crypto-transaction",
        },
        {
            package: "@mainsail/crypto-transaction-username-registration",
        },
        {
            package: "@mainsail/crypto-transaction-username-resignation",
        },
        {
            package: "@mainsail/crypto-transaction-validator-registration",
        },
        {
            package: "@mainsail/crypto-transaction-validator-resignation",
        },
        {
            package: "@mainsail/crypto-transaction-multi-payment",
        },
        {
            package: "@mainsail/crypto-transaction-multi-signature-registration",
        },
        {
            package: "@mainsail/crypto-transaction-transfer",
        },
        {
            package: "@mainsail/crypto-transaction-vote",
        },
    ],
};

export default config;
