import { injectable } from "@mainsail/container";
import { Contracts } from "@mainsail/contracts";
import { Base } from "./base.js";
import { encodeFunctionData } from "viem";
import { ContractData, ContractBuilder as IContractBuilder } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

@injectable()
export class ContractBuilder extends Base implements IContractBuilder {
    async makeDeploy(contractData: ContractData): Promise<Contracts.Crypto.Transaction> {
        const walletNonce = await this.wallet.getNonce();

        let builder = this.app
            .resolve(TransactionBuilder)
            .gasPrice(this.config.gasPrice)
            .payload(contractData.bytecode.slice(2))
            .gasLimit(2_000_000)
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

        const func = contractData.transactions[functionIndex];
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
            .gasLimit(1_000_000)
            .recipientAddress(contractData.contractId)
            .value(amount)
            .nonce(walletNonce.toString());

        await this.sign(builder);
        return builder.build();
    };
}
