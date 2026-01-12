import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";

import { Client, Logger, Config, Flags, JSONRPCResultSuccess, JSONRPCResultError } from "../types.js";
import { AppIdentifiers } from "../identifiers.js";
import { sleep, hasFlag } from "../utils.js";

@injectable()
export abstract class BaseHandler {
    @inject(AppIdentifiers.Logger)
    protected logger!: Logger;

    @inject(AppIdentifiers.Config)
    protected config!: Config;

    @inject(AppIdentifiers.Client)
    protected client!: Client;

    protected flags!: Flags;

    protected async handle(transaction: Contracts.Crypto.Transaction): Promise<void> {
        this.#logTransaction(transaction);

        await this.#gasEstimate(transaction);
        await this.#simulate(transaction);

        this.logSend(transaction);
        await this.client.postTransaction(transaction.serialized.toString("hex"));

        await this.#waitForOneBlock();
        await this.#logTransactionReceipt(transaction);
    }

    async #gasEstimate(transaction: Contracts.Crypto.Transaction): Promise<void> {
        if (!hasFlag(this.flags, "estimateGas")) {
            this.logger.line();
            this.logger.log("Skipping gas estimation.");
            return;
        }

        this.logger.line();
        this.logger.log("Estimating gas...");

        const data = {
            from: transaction.data.from,
            to: transaction.data.to!,
            data: `0x${transaction.data.data}`,
            // gas: `0x${transaction.data.gasLimit?.toString(16)}`,
            // gasPrice: `0x${transaction.data.gasPrice?.toString(16)}`,
            value: transaction.data.value ? `0x${transaction.data.value.toString(16)}` : undefined,
        };

        this.logger.log("Gas estimation call data:");
        this.logger.log(JSON.stringify(data, null, 2));

        const gasEstimate = await this.client.ethEstimateGas(data);
        if (!gasEstimate.success) {
            this.logger.log(`Error estimating gas: ${gasEstimate.message}`);

            if (!hasFlag(this.flags, "forceSend")) {
                process.exit(0);
            }
            return;
        }

        this.logger.logKV("Estimated gas", gasEstimate.result);
    }

    async #simulate(transaction: Contracts.Crypto.Transaction): Promise<void> {
        if (hasFlag(this.flags, "skipSimulate")) {
            this.logger.line();
            this.logger.log("Skipping transaction simulation.");
            return;
        }

        this.logger.line();
        this.logger.log("Simulating transaction...");

        const data = {
            from: transaction.data.from,
            to: transaction.data.to!,
            data: `0x${transaction.data.data}`,
            gas: `0x${transaction.data.gasLimit?.toString(16)}`,
            gasPrice: `0x${transaction.data.gasPrice?.toString(16)}`,
            value: transaction.data.value ? `0x${transaction.data.value.toString(16)}` : undefined,
        };

        this.logger.log("Simulation call data:");
        this.logger.log(JSON.stringify(data, null, 2));

        const response = await this.client.ethCall(data);
        if (response.success) {
            this.simulateSuccess(transaction, response);
            return;
        }

        this.logger.line();
        this.logger.log(`Simulation failed: ${response.message}`);

        if (response.data) {
            this.simulateError(response);
        }

        if (!hasFlag(this.flags, "forceSend")) {
            process.exit(0);
        }
    }

    async #waitForOneBlock(): Promise<void> {
        if (!this.config.waitForBlock) {
            return;
        }

        const timeout = 2000; // 2 seconds

        const startHeight = await this.client.getHeight();
        this.logger.line();
        this.logger.log("Waiting for next block...");
        await sleep(timeout);

        while (startHeight + 1 >= (await this.client.getHeight())) {
            this.logger.log(".");
            await sleep(timeout);
        }
    }

    async #logTransactionReceipt(tx: Contracts.Crypto.Transaction): Promise<void> {
        this.logger.line();
        this.logger.log(`Fetching transaction receipt for hash: 0x${tx.hash}`);

        const result = await this.client.getReceipt(tx.hash);
        if (!result.success) {
            throw new Error(`Error getting transaction receipt: ${result.message}`);
        }

        const receipt = result.result;
        if (receipt === null) {
            this.logger.log("Transaction was not forged.");
            return;
        }

        if (receipt.status === "0x0") {
            this.logger.log("Transaction failed:");
            if (parseInt(receipt.gasUsed) >= tx.data.gasLimit) {
                this.logger.log("Error: Out of gas");
            }
        } else {
            this.logger.log("Transaction succeeded:");
        }

        this.logger.log(JSON.stringify(receipt, null, 2));
    }

    #logTransaction(transaction: Contracts.Crypto.Transaction): void {
        this.logger.line();
        this.logger.logKV("Serialized transaction", `0x${transaction.serialized.toString("hex")}`);
    }

    protected abstract simulateSuccess(
        transaction: Contracts.Crypto.Transaction,
        response: JSONRPCResultSuccess<string>,
    ): Promise<void>;

    protected abstract simulateError(response: JSONRPCResultError): Promise<void>;

    protected abstract logSend(transaction: Contracts.Crypto.Transaction): void;
}
