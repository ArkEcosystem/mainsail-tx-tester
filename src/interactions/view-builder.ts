import { injectable } from "@mainsail/container";
import { Base } from "./base.js";
import { Config, ViewBuilder as IViewBuilder, EthViewParameters, ContractData } from "../types.js";
import { encodeFunctionData, decodeFunctionResult } from "viem";

@injectable()
export class ViewBuilder extends Base implements IViewBuilder {
    makeView = async (contractData: ContractData, index: number): Promise<EthViewParameters> => {
        const func = contractData.views[index];

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

    decodeEvmViewResult = (config: Config, contractData: ContractData, index: number, data: any): void => {
        const func = contractData.views[index];

        let result;
        try {
            result = decodeFunctionResult({
                abi: contractData.abi,
                functionName: func.functionName,
                data,
            });
        } catch (ex) {
            result = ex.message;
        }

        console.log(`Result:   ${data}`);
        console.log(`Decoded:`);
        console.log(`${JSON.stringify(result, (_, v) => (typeof v === "bigint" ? v.toString() : v), "  ")}`);
    };
}
