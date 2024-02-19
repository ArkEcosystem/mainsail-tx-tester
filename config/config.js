const crypto = require("mainsail-network-config/testnet/mainsail/crypto.json");

module.exports = {
    peer: {
        ip: "127.0.0.1",
        port: "4003",
        protocol: "http",
    },
    crypto: crypto,
    senderPassphrase:
        "foam very swear render trial rapid large step raven sunny drift orchard cushion pipe file legend save kangaroo develop usage vast drama word win",
    transfer: {
        recipientId: "ark1ychmwwx6h332dkc0ykgn0e0s6c7jhk0j4j8wwqv66jualrun29msyccfzf",
        fee: "10000000",
        amount: "1",
        vendorField: "vendor field",
    },
    vote: {
        voteAsset: "d2ebcc8c5827e5c0feb0f226f84e4bffc7275729b8a04464f84cabcfc7bedcb1",
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
                recipientId: "ark1ychmwwx6h332dkc0ykgn0e0s6c7jhk0j4j8wwqv66jualrun29msyccfzf",
                amount: "100000000",
            },
            {
                recipientId: "ark1saw3xnkjw5cx0hwzka5e9jg96gtn4lu0uhsxngcrltgly70sy93s99tahy",
                amount: "200000000",
            },
        ],
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
