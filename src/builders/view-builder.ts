import { injectable, inject } from "@mainsail/container";
import { Base, deployFunction } from "./base.js";
import { ViewBuilder as IViewBuilder, EthViewParameters, ContractData, Logger } from "../types.js";
import { encodeFunctionData, decodeFunctionResult, decodeErrorResult } from "viem";
import { AppIdentifiers } from "../identifiers.js";

// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#panic-via-assert-and-error-via-require
const panicReasons = {
    1: "An `assert` condition failed",
    17: "Arithmetic operation resulted in underflow or overflow",
    18: "Division or modulo by zero",
    33: "Attempted to convert to an invalid type",
    34: "Attempted to access a storage byte array that is incorrectly encoded",
    49: "Performed `.pop()` on an empty array",
    50: "Array index is out of bounds",
    65: "Allocated too much memory or created an array which is too large",
    81: "Attempted to call a zero-initialized variable of internal function type",
} as const;

@injectable()
export class ViewBuilder extends Base implements IViewBuilder {
    @inject(AppIdentifiers.Logger)
    private logger!: Logger;

    makeView = async (contractData: ContractData, functionIndex: number): Promise<EthViewParameters> => {
        const func = [deployFunction, ...contractData.transactions, ...contractData.views][functionIndex];

        const args = func.args;

        this.normalizeContractCallArgs(contractData, func.functionName, args);

        const data = encodeFunctionData({
            abi: contractData.abi,
            functionName: func.functionName,
            args,
        });

        console.log(`Function: ${func.functionName}`);
        console.log(`Args:     ${args.join(", ")}`);
        console.log(`Encoded:  ${data}`);

        return {
            from: await this.wallet.getAddress(),
            to: contractData.contractId,
            data: data,
        };
    };

    decodeViewResult = (contractData: ContractData, functionIndex: number, data: string): void => {
        const func = [deployFunction, ...contractData.transactions, ...contractData.views][functionIndex];

        try {
            this.logger.line();
            this.logger.log(`Decoded result:`);
            this.logger.log(`Bytes : ${data}`);
            this.logger.log(`Func  : ${func.functionName}`);

            if (func === deployFunction) {
                return;
            }

            const result = decodeFunctionResult({
                abi: contractData.abi,
                functionName: func.functionName,
                data: data as `0x${string}`,
            });
            this.logger.log(
                `Result: ${JSON.stringify(result, (_, v) => (typeof v === "bigint" ? v.toString() : v), "  ")}`,
            );
        } catch (ex) {
            this.logger.log(`Failed to decode result: ${ex.message}`);
        }
    };

    decodeViewError = (contractData: ContractData, data: string | undefined): void => {
        try {
            this.logger.line();
            this.logger.log(`Decoded error:`);
            this.logger.log(`Bytes: ${data}`);

            if (!data) {
                return;
            }

            const result = decodeErrorResult({
                abi: contractData.abi,
                data: data as `0x${string}`,
            });
            this.logger.log(`Name : ${result.errorName}`);
            this.logger.log(`Args : ${result.args?.length ? result.args.join(", ") : "None"}`);

            if (result.errorName === "Panic" && result.args && result.args.length) {
                const code = result.args[0] as number;
                const reason = panicReasons[code as keyof typeof panicReasons] || "Unknown panic code";
                this.logger.log(`Panic: ${reason}`);
            }
        } catch (ex) {
            this.logger.log(`Failed to decode error: ${ex.message}`);
        }
    };
}
