import { injectable, inject } from "@mainsail/container";
import { Base, deployFunction } from "./base.js";
import { ViewBuilder as IViewBuilder, EthViewParameters, ContractData, Logger } from "../types.js";
import { encodeFunctionData, decodeFunctionResult, decodeErrorResult } from "viem";
import { AppIdentifiers } from "../identifiers.js";

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

    decodeViewError = (contractData: ContractData, data: string): void => {
        try {
            const result = decodeErrorResult({
                abi: contractData.abi,
                data: data as `0x${string}`,
            });

            this.logger.line();
            this.logger.log(`Decoded error:`);
            this.logger.log(`Bytes: ${data}`);
            this.logger.log(`Name : ${result.errorName}`);
            this.logger.log(`Args : ${result.args?.length ? result.args.join(", ") : "None"}`);
        } catch (ex) {
            this.logger.log(`Failed to decode error: ${ex.message}`);
        }
    };
}
