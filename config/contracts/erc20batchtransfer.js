import ERC20BatchTransfer from "../builds/ERC20BatchTransfer.json" with { type: "json" };

export const erc20batchtransfer = {
    abi: ERC20BatchTransfer.abi,
    name: "ERC20BatchTransfer",
    contractId: "0x0f6B0a8a50E12b554ceb20e909d3F627A1DCC3F6",
    bytecode: ERC20BatchTransfer.bytecode,
    transactions: [
        {
            functionName: "batchTransferFrom",
              args: [
                "", // Approved ERC20 token contract address
                [
                    "0x0000000000000000000000000000000000000001", // Recipient 1
                    "0x0000000000000000000000000000000000000002", // Recipient 2
                    "0x0000000000000000000000000000000000000003", // Recipient 3
                ], [
                    1, // Amount 1
                    2, // Amount 2
                    3, // Amount 3
                ]
            ],
        },
        {
            functionName: "multiBatchTransferFrom",
            args: [[],[],[]],
        }
    ],
    views: [],
};
