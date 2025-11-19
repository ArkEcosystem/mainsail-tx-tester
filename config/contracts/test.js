import Test from "../builds/Test.json" with { type: "json" };

export const test = {
    abi: Test.abi,
    name: "Test",
    contractId: "", // Add deployed contract address here
    transactions: [
        {
            functionName: "setCounter",
            args: [0],
        },
    ],
    views: [
        {
            functionName: "getCounter",
            args: [],
        },
    ],
};
