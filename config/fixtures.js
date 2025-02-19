import { consensus } from "./contracts/consensus.js";
import { usernames } from "./contracts/usernames.js";
import { multiPayment } from "./contracts/multipayment.js";

const fixtureConfig = {
    "transfer": {
        recipientAddress: "0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22",
        value: "100000000",
    },
    "transfer-0": {
        nonce: "123",
        recipientAddress: "0xb693449adda7efc015d87944eae8b7c37eb1690a",
    },
    "transfer-large-amount": {
        nonce: "17",
        recipientAddress: "0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22",
        value: "10000000000000000000",
    },
    "vote": {
        contract: {
            data: consensus,
            functionName: "vote",
            args: ["0xc3bbe9b1cee1ff85ad72b87414b0e9b7f2366763"],
        },
        gasLimit: 1000000,
    },
    "unvote": {
        contract: {
            data: consensus,
            functionName: "unvote",
        },
        gasLimit: 1000000,
    },
    "validator-registration": {
        contract: {
            data: consensus,
            functionName: "registerValidator",
            args: ["0x30954f46d6097a1d314e900e66e11e0dad0a57cd03e04ec99f0dedd1c765dcb11e6d7fa02e22cf40f9ee23d9cc1c0624"],
        },
        gasLimit: 1000000,
    },
    "validator-resignation": {
        contract: {
            data: consensus,
            functionName: "resignValidator",
        },
        gasLimit: 1000000,
    },
    "username-registration": {
        contract: {
            data: usernames,
            functionName: "registerUsername",
            args: ["php"],
        },
        gasLimit: 1000000,
        username: "abc",
    },
    "username-resignation": {
        contract: {
            data: usernames,
            functionName: "resignUsername",
        },
        gasLimit: 1000000,
    },
    "multipayment": {
        contract: {
            data: multiPayment,
            functionName: "pay",
            args: [["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5", "0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"], ["100000000", "200000000"]],
        },
        gasLimit: 1000000,
        value: "300000000",
    },
    "multipayment-single": {
        contract: {
            data: multiPayment,
            functionName: "pay",
            args: [["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"], ["100000000"]],
        },
        gasLimit: 1000000,
        value: "100000000",
    },
    "multipayment-empty": {
        contract: {
            data: multiPayment,
            functionName: "pay",
            args: [[], []],
        },
        gasLimit: 1000000,
    },
};

export default fixtureConfig;