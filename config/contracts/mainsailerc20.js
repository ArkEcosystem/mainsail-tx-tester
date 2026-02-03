import MainsailERC20 from "../builds/MainsailERC20.json" with { type: "json" };
import { parseEther } from "viem";

export const mainsailerc20 = {
    abi: MainsailERC20.abi,
    name: "MainsailERC20",
    contractId: "", // Add deployed contract address here
    // Name, Symbol, Initial Supply
    constructorArgs: ["DARK20", "DARK20", parseEther("100000000")],
    bytecode: MainsailERC20.bytecode,
    transactions: [
        {
            functionName: "approve",
            args: ["0x0000000000000000000000000000000000000000",0],
        },
        {
            functionName: "transfer",
            args: ["0x0000000000000000000000000000000000000000",0],
        },
        {
            functionName: "transferFrom",
            args: ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000",0],
        }
    ],
    views: [
        {
            functionName: "allowance",
            args: ["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"],
        },
        {
            functionName: "balanceOf",
            args: ["0x0000000000000000000000000000000000000000"],
        },
        {
            functionName: "decimals",
            args: [],
        },
        {
            functionName: "name",
            args: [],
        },
        {
            functionName: "symbol",
            args: [],
        },
        {
            functionName: "totalSupply",
            args: [],
        }
    ],
};
