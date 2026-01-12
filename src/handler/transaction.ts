import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";

import {
    TransactionHandler as ITransactionHandler,
    JSONRPCResultSuccess,
    JSONRPCResultError,
    Flags,
    TransferBuilder,
} from "../types.js";
import { AppIdentifiers } from "../identifiers.js";
import { BaseHandler } from "./base.js";

@injectable()
export class TransactionHandler extends BaseHandler implements ITransactionHandler {
    @inject(AppIdentifiers.TransferBuilder)
    protected transferBuilder!: TransferBuilder;

    public async sendTransaction(
        flags: Flags,
        recipient: string | undefined,
        amount: string | undefined,
    ): Promise<void> {
        this.flags = flags;

        const transaction = await this.transferBuilder.makeTransfer(this.config, recipient, amount);
        this.handle(transaction);
    }

    protected async simulateSuccess(
        transaction: Contracts.Crypto.Transaction,
        response: JSONRPCResultSuccess<string>,
    ): Promise<void> {
        this.logger.line();
        this.logger.log(`Simulation successful: ${response.result}`);
    }

    protected async simulateError(response: JSONRPCResultError): Promise<void> {
        this.logger.line();
        this.logger.log(`Simulation failed: ${response.message}`);
    }

    protected logSend(transaction: Contracts.Crypto.Transaction): void {
        this.logger.line();
        this.logger.logKV("Transaction sent", `0x${transaction.hash}`);
    }
}
