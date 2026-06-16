import { injectable } from "@mainsail/container";
import type { Contracts } from "@mainsail/contracts";
import { Base, deployFunction } from "./base.js";
import { bytesToHex, encodeDeployData, encodeFunctionData } from "viem";
import { ContractData, ContractBuilder as IContractBuilder } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";
import { buildProofOfPossession } from "@mainsail/crypto-key-pair-bls12-381";
import { Identifiers } from "@mainsail/constants";

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
        let usedArgs = args || func.args;

        this.normalizeContractCallArgs(contractData, func.functionName, usedArgs);

        if (!amount) {
            amount = func.amount ? func.amount.toString() : "0";
        }

        // Create Proof of Possession if not manually specified
        if (["registerValidator", "updateValidator"].includes(func.functionName) && usedArgs.length === 1) {
            const keyPairFactory = this.app.getTagged<Contracts.Crypto.KeyPairFactory>(
                Identifiers.Cryptography.Identity.KeyPair.Factory,
                "type",
                "consensus",
            );
            const keyPair = await keyPairFactory.fromMnemonic(this.config.validatorPassphrase);
            const { pk, pop } = buildProofOfPossession(Buffer.from(keyPair.privateKey, "hex"));

            const validatorPublicKey = bytesToHex(pk);
            const validatorPop = bytesToHex(pop);
            console.log({
                validatorPop,
                validatorPublicKey,
            });

            usedArgs = [validatorPublicKey, validatorPop];
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
