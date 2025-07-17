import { UsernamesAbi } from "@mainsail/evm-contracts";

export const revert = {
    abi: UsernamesAbi.abi,
    name: "Revert",
    // Usernames ABI on MultiPayment contract
    contractId: "0x83769BeEB7e5405ef0B7dc3C66C43E3a51A6d27f",
    transactions: [
        {
            functionName: "registerUsername",
            args: ["revertme"],
        },
    ],
    views: [],
};
