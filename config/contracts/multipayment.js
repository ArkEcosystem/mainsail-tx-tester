import { MultiPaymentAbi } from "@mainsail/evm-contracts";

export const multiPayment = {
    abi: MultiPaymentAbi.abi,
    name: "MultiPayment",
    contractId: "0x83769BeEB7e5405ef0B7dc3C66C43E3a51A6d27f",
    transactions: [
        {
            functionName: "pay",
            args: [["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"], [100]],
            amount: 100,
        },
    ],
    views: [],
};
