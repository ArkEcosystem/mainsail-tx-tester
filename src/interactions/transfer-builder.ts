import { injectable, inject } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { AppIdentifiers } from "../identifiers.js";
import { Config, TransferBuilder as ITransferBuilder, Wallet } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

@injectable()
export class TransferBuilder implements ITransferBuilder {
    @inject(Identifiers.Application.Instance)
    private readonly app!: Contracts.Kernel.Application;

    @inject(AppIdentifiers.Wallet)
    private readonly wallet!: Wallet;

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

        await builder.signWithKeyPair(await this.wallet.getKeyPair());

        if (this.wallet.hasSecondPassphrase()) {
            builder = await builder.legacySecondSign(this.wallet.getSecondPassphrase());
        }

        return builder.build();
    }
}
