import Test2 from "../builds/Test2.json" with { type: "json" };

export const test2 = {
    abi: Test2.abi,
    name: "Test2",
    contractId: "", // Add deployed contract address here
    bytecode: Test2.bytecode,
    constructorArgs: [42, 1],
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
