import { ConsensusAbi } from "@mainsail/evm-contracts";

export const consensus = {
    view: {
        abi: ConsensusAbi.abi,
        contractId: "0x535B3D7A252fa034Ed71F0C53ec0C6F784cB64E1",
        functions: [
            {
                functionName: "version",
                args: [],
            },
            {
                functionName: "registeredValidatorsCount",
                args: [],
            },
            {
                functionName: "resignedValidatorsCount",
                args: [],
            },
            {
                functionName: "activeValidatorsCount",
                args: [],
            },
            {
                functionName: "isValidatorRegistered",
                args: ["0x535B3D7A252fa034Ed71F0C53ec0C6F784cB64E1"],
            },
            {
                functionName: "getValidator",
                args: ["0x535B3D7A252fa034Ed71F0C53ec0C6F784cB64E1"],
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
            {
                functionName: "getAllValidators",
                args: [],
            },
            {
                functionName: "getVotes",
                args: ["0x0000000000000000000000000000000000000000", 100],
            },
            {
                functionName: "getRounds",
                args: [0, 100],
            },
        ],
    },
};
