import { ConsensusAbi } from "@mainsail/evm-contracts";

export const consensus = {
    abi: ConsensusAbi.abi,
    name: "Consensus",
    contractId: "0x535B3D7A252fa034Ed71F0C53ec0C6F784cB64E1",
    transactions: [
        {
            functionName: "registerValidator",
            amount: "250000000000000000000",
            args: [`0x${"0".repeat(96)}`],
        },
        {
            functionName: "updateValidator",
            args: [`0x${"1".repeat(96)}`],
        },
        {
            functionName: "resignValidator",
            args: [],
        },
        {
            functionName: "vote",
            args: ["0x8233F6Df6449D7655f4643D2E752DC8D2283fAd5"],
        },
        {
            functionName: "unvote",
            args: [],
        },

        // Only for Mainsail internals
        // {
        //     functionName: "addValidator",
        //     args: [],
        // },
        // {
        //     functionName: "addVote",
        //     args: [],
        // },
        // {
        //     functionName: "updateVoters",
        //     args: [],
        // },
        // {
        //     functionName: "calculateActiveValidators",
        //     args: [],
        // },
    ],
    views: [
        {
            functionName: "version",
            args: [],
        },
        {
            functionName: "fee",
            args: [],
        },
        {
            functionName: "validatorsCount",
            args: [],
        },
        {
            functionName: "activeValidatorsCount",
            args: [],
        },
        {
            functionName: "resignedValidatorsCount",
            args: [],
        },
                {
            functionName: "roundValidatorsCount",
            args: [],
        },
        {
            functionName: "isValidatorRegistered",
            args: ["0x9f99156fCfD4fBb2EB547c479B2f59F2ABaA871a"],
        },
        {
            functionName: "getValidator",
            args: ["0x9f99156fCfD4fBb2EB547c479B2f59F2ABaA871a"],
        },
        {
            functionName: "getRoundValidators",
            args: [],
        },
        {
            functionName: "getVotesCount",
            args: [],
        },
        {
            functionName: "getRoundsCount",
            args: [],
        },

        // Only for Mainsail internals
        // {
        //     functionName: "getAllValidators",
        //     args: [],
        // },
        // {
        //     functionName: "getVotes",
        //     args: ["0x0000000000000000000000000000000000000000", 100],
        // },
        // {
        //     functionName: "getRounds",
        //     args: [0, 100],
        // },
    ],
};
