import TestContract from "../builds/TestContract.json" with { type: "json" };

export const testcontract = {
    abi: TestContract.abi,
    name: "TestContract",
    contractId: "", // Add deployed contract address here
    transactions: [
        {
            functionName: "setCounter",
            args: [0],
        }
    ],
    views: [
        {
            functionName: "getCounter",
            args: [],
        }
    ],
};
