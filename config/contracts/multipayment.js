import { MultiPaymentAbi } from "@mainsail/evm-contracts";

export const multiPayment = {
    abi: MultiPaymentAbi.abi,
    name: "MultiPayment",
    contractId: "0x00EFd0D4639191C49908A7BddbB9A11A994A8527",
    bytecode: MultiPaymentAbi.bytecode,
    transactions: [
        {
            functionName: "pay",
            args: [["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"], [100]],
            amount: 100,
        },
    ],
    views: [],
};
