import Test from "../builds/Test.json" with { type: "json" };

export const test = {
    abi: Test.abi,
    name: "Test",
    contractId: "", // Add deployed contract address here
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
            functionName: "setCounterAndReturn",
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
            functionName: "divideCounter",
            args: [0],
        },
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
