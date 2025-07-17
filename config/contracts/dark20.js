import DARK20 from "../builds/DARK20.json" with { type: "json" };

export const dark20 = {
    abi: DARK20.abi,
    name: "DARK20",
    contractId: "",
    transactions: [
        {
            functionName: "transfer",
            args: ["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5", 100],
        },
    ],
    views: [
        {
            functionName: "name",
            args: [],
        },
        {
            functionName: "symbol",
            args: [],
        },
        {
            functionName: "totalSupply",
            args: [],
        },
        {
            functionName: "balanceOf",
            args: ["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"],
        },
    ],
};
