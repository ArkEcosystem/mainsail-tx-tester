import Test from "../builds/Test.json" with { type: "json" };

export const test = {
    abi: Test.abi,
    name: "Test",
    // contractId: "0xA762F523d959eEefc3012Aa20Af636eEFad6e99c", // Add deployed contract address here
    contractId: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Add deployed contract address here
    bytecode: Test.bytecode,
    transactions: [
        {
            functionName: "incrementCounter",
            args: [],
        },
        {
            functionName: "setCounter",
            args: [0],
        },
        {
            functionName: "useError",
            args: [],
        },
        {
            functionName: "useErrorWithAttributes",
            args: [],
        },
        {
            functionName: "useRevert",
            args: [],
        },
    ],
    views: [
        {
            functionName: "getCounter",
            args: [],
        },
        {
            functionName: "useErrorView",
            args: [],
        },
        {
            functionName: "useErrorWithAttributesView",
            args: [],
        },
        {
            functionName: "useRevertView",
            args: [],
        },
    ],
};
