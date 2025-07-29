import { UsernamesAbi } from "@mainsail/evm-contracts";

export const usernames = {
    abi: UsernamesAbi.abi,
    name: "Usernames",
    contractId: "0x2c1DE3b4Dbb4aDebEbB5dcECAe825bE2a9fc6eb6",
    transactions: [
        {
            functionName: "registerUsername",
            args: ["abc"],
        },
        {
            functionName: "resignUsername",
            args: [],
        },
        {
            functionName: "vote",
            args: ["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"],
        },

        // Only for Mainsail internals
        // {
        //     functionName: "addUsername",
        //     args: [],
        // },
    ],
    views: [
        {
            functionName: "version",
            args: [],
        },
        {
            functionName: "getUsername",
            args: ["0x9f99156fCfD4fBb2EB547c479B2f59F2ABaA871a"],
        },
        {
            functionName: "isUsernameRegistered",
            args: ["abc"],
        },
        {
            functionName: "isUsernameValid",
            args: ["abc"],
        },
        {
            functionName: "getUsernames",
            args: [["0x9f99156fCfD4fBb2EB547c479B2f59F2ABaA871a"]],
        },
    ],
};
