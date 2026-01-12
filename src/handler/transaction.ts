import { Contracts } from "@mainsail/contracts";
import { injectable } from "@mainsail/container";

import {
    TransactionHandler as ITransactionHandler,
    JSONRPCResultSuccess,
    JSONRPCResultError,
    Flags,
} from "../types.js";
import { BaseHandler } from "./base.js";

@injectable()
export class TransactionHandler extends BaseHandler implements ITransactionHandler {
    public async sendTransaction(tx: Contracts.Crypto.Transaction, flags: Flags): Promise<void> {
        this.flags = flags;
        this.handle(tx);
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
