import { injectable } from "@mainsail/container";
import { Contracts } from "@mainsail/contracts";
import { Base } from "./base.js";
import { Config, TransferBuilder as ITransferBuilder } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

@injectable()
export class TransferBuilder extends Base implements ITransferBuilder {
    public async makeTransfer(
        config: Config,
        recipient?: string,
        amount?: string,
    ): Promise<Contracts.Crypto.Transaction> {
        const { transfer } = config;

        const walletNonce = await this.wallet.getNonce();

        let builder = this.app
            .resolve(TransactionBuilder)
            .gasPrice(config.gasPrice)
            .gasLimit(21000)
            .nonce(walletNonce.toFixed(0))
            .recipientAddress(recipient ? recipient : transfer.recipientAddress)
            .value(amount ? amount : transfer.value)
            .payload("");

        await this.sign(builder);
        return builder.build();
    }
}
