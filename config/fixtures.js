import { consensus } from "./contracts/consensus.js";
import { dark20 } from "./contracts/dark20.js";
import { multiPayment } from "./contracts/multipayment.js";
import { usernames } from "./contracts/usernames.js";

const fixtureConfig = {
    passphrase:
        "found lobster oblige describe ready addict body brave live vacuum display salute lizard combine gift resemble race senior quality reunion proud tell adjust angle",
    secondPassphrase: "",
    transfer: {
        recipientAddress: "0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22",
        value: "100000000",
    },
    "transfer-0": {
        recipientAddress: "0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22",
    },
    "transfer-large-amount": {
        recipientAddress: "0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22",
        value: "10000000000000000000",
    },
    "transfer-legacy-second-signature": {
        recipientAddress: "0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22",
        value: "100000000",
        secondPassphrase:
            "gold favorite math anchor detect march purpose such sausage crucial reform novel connect misery update episode invite salute barely garbage exclude winner visa cruise",
    },
    vote: {
        contract: {
            data: consensus,
            functionName: "vote",
            args: ["0xc3bbe9b1cee1ff85ad72b87414b0e9b7f2366763"],
        },
        gasLimit: 200000,
    },
    unvote: {
        contract: {
            data: consensus,
            functionName: "unvote",
        },
        gasLimit: 200000,
    },
    "validator-registration": {
        contract: {
            data: consensus,
            functionName: "registerValidator",
            args: [
                "0xafb0dc0443f76223b1cd714d3f6aa625541d2367516678ac8d6108f983d38fe22fd7ec09d538efb2ea5ced8ebab6d1ea",
                "0x8393b6cff09760c55785613d5ef0b8ec8d591bb16ef177a39758cd4ed932ad761d6a6ab84d845a5c6dc54b20de95249118f37426d9a39011c6515112cc56469d02fed8c6a5089a2bd056a72dc7291c883822d599e30503a00d22eb84b7fb5d15",
            ],
        },
        gasLimit: 200000,
        value: "250000000000000000000",
    },
    "validator-resignation": {
        contract: {
            data: consensus,
            functionName: "resignValidator",
        },
        gasLimit: 200000,
    },
    "username-registration": {
        contract: {
            data: usernames,
            functionName: "registerUsername",
            args: ["fixture"],
        },
        gasLimit: 200000,
    },
    "username-resignation": {
        contract: {
            data: usernames,
            functionName: "resignUsername",
        },
        gasLimit: 200000,
    },
    multipayment: {
        contract: {
            data: multiPayment,
            functionName: "pay",
            args: [
                ["0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22", "0xc3bbe9b1cee1ff85ad72b87414b0e9b7f2366763"],
                ["100000", "200000"],
            ],
        },
        gasLimit: 200000,
        value: "300000",
    },
    "multipayment-single": {
        contract: {
            data: multiPayment,
            functionName: "pay",
            args: [["0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22"], ["100000"]],
        },
        gasLimit: 200000,
        value: "100000",
    },
    "multipayment-empty": {
        contract: {
            data: multiPayment,
            functionName: "pay",
            args: [[], []],
        },
        gasLimit: 200000,
    },
    "evm-sign": {
        contract: {
            data: dark20,
            functionName: "transfer",
            args: ["0x27fa7caffaae77ddb9ab232fdbda56d5e5af2393", "100"],
        },
        recipientAddress: "0xe536720791a7dadbebdbcd8c8546fb0791a11901",
        gasLimit: 200000,
    },
};

export default fixtureConfig;
