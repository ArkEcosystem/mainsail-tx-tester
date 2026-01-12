import { injectable } from "@mainsail/container";
import { Contracts } from "@mainsail/contracts";
import { Base, deployFunction } from "./base.js";
import { encodeDeployData, encodeFunctionData } from "viem";
import { ContractData, ContractBuilder as IContractBuilder } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

@injectable()
export class ContractBuilder extends Base implements IContractBuilder {
    async makeDeploy(contractData: ContractData): Promise<Contracts.Crypto.Transaction> {
        const walletNonce = await this.wallet.getNonce();

        let deployData = contractData.bytecode;
        if (contractData.constructorArgs && contractData.constructorArgs.length > 0) {
            deployData = encodeDeployData({
                abi: contractData.abi,
                args: contractData.constructorArgs,
                bytecode: contractData.bytecode as `0x${string}`,
            });
        }

        let builder = this.app
            .resolve(TransactionBuilder)
            .gasPrice(this.config.gasPrice)
            .payload(deployData)
            .gasLimit(this.config.gasLimit)
            .nonce(walletNonce.toString());

        await this.sign(builder);
        return builder.build();
    }

    makeCall = async (
        contractData: ContractData,
        functionIndex: number,
        args?: any[],
        amount?: string,
    ): Promise<Contracts.Crypto.Transaction> => {
        const walletNonce = await this.wallet.getNonce();

        const func = [deployFunction, ...contractData.transactions][functionIndex];
        const usedArgs = args || func.args;

        this.normalizeContractCallArgs(contractData, func.functionName, usedArgs);

        if (!amount) {
            amount = func.amount ? func.amount.toString() : "0";
        }

        const data = encodeFunctionData({
            abi: contractData.abi,
            functionName: func.functionName,
            args: usedArgs,
        });

        console.log(`Function: ${func.functionName}`);
        console.log(`Args:     ${usedArgs.join(", ")}`);
        console.log(`Amount:     ${amount}`);
        console.log(`Encoded:  ${data}`);

        let builder = this.app
            .resolve(TransactionBuilder)
            .gasPrice(this.config.gasPrice)
            .payload(data.slice(2))
            .gasLimit(this.config.gasLimit)
            .recipientAddress(contractData.contractId)
            .value(amount)
            .nonce(walletNonce.toString());

        await this.sign(builder);
        return builder.build();
    };
}
