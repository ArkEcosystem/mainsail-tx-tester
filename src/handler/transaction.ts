import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";

import { Client, Logger, TransactionHandler as ITransactionHandler } from "../types.js";
import { AppIdentifiers } from "../identifiers.js";

@injectable()
export class TransactionHandler implements ITransactionHandler {
    @inject(AppIdentifiers.Logger)
    private logger!: Logger;

    @inject(AppIdentifiers.Client)
    private client!: Client;

    public async sendTransaction(tx: Contracts.Crypto.Transaction): Promise<void> {
        await this.client.postTransaction(tx.serialized.toString("hex"));

        this.logger.line();
        this.logger.logKV("Transaction sent: ", `0x${tx.hash}`);
        this.logger.line();
    }
}
