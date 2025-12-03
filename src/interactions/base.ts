import { Contracts, Identifiers } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";
import { AppIdentifiers } from "../identifiers.js";
import { Config, Wallet, ContractData } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

import { AbiFunction } from "viem";

export const deployFunction = {
    functionName: "deploy",
    args: [],
    amount: "0",
};

@injectable()
export class Base {
    @inject(Identifiers.Application.Instance)
    protected readonly app!: Contracts.Kernel.Application;

    @inject(AppIdentifiers.Wallet)
    protected readonly wallet!: Wallet;

    @inject(AppIdentifiers.Config)
    protected config!: Config;

    protected async sign(builder: TransactionBuilder): Promise<void> {
        await builder.signWithKeyPair(await this.wallet.getKeyPair());

        if (this.wallet.hasSecondPassphrase()) {
            builder = await builder.legacySecondSign(this.wallet.getSecondPassphrase());
        }
    }

    // Ensure address/byte array args have 0x prefix
    protected normalizeContractCallArgs(contractData: ContractData, functionName: string, args: any[]) {
        for (let i = 0; i < args.length; i++) {
            const functionAbi = contractData.abi.find(
                (item) => item.type === "function" && item.name === functionName,
            ) as AbiFunction | null;
            if (!functionAbi) {
                throw new Error("missing ABI for function: " + functionName);
            }

            const input = functionAbi.inputs[i];
            if (input.type === "address" || input.type === "bytes") {
                if (!args[i].startsWith("0x")) {
                    args[i] = `0x${args[i]}`;
                }
            }
        }
    }
}
