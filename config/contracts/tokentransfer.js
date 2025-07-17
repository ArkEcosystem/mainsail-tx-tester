import DARK20 from "../builds/DARK20.json" with { type: "json" };

export const tokenTransfer = {
    abi: DARK20.abi,
    name: "Token Transfer",
    contractId: "", // Add deployed_contract_address here 
    transactions: [
        {
            functionName: "transfer",
            args: ["0x6F0182a0cc707b055322CcF6d4CB6a5Aff1aEb22", "100000"],
        },
    ],
    views: [],
};
