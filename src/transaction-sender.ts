import { Contracts } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";

import { Client, Logger, TransactionSender as ITransactionSender } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";

@injectable()
export class TransactionSender implements ITransactionSender {
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

// const waitForOneBlock = async (peer: string): Promise<void> => {
//     return;

//     const timeout = 2000; // 2 seconds

//     const startHeight = await Client.getHeight(peer);
//     console.log("Waiting for next block...");
//     await sleep(timeout);

//     while (startHeight + 1 >= (await Client.getHeight(peer))) {
//         console.log(".");
//         await sleep(timeout);
//     }
// };

// const logTransactionResult = async (peer: string, txHash: string): Promise<void> => {
//     console.log(`Fetching transaction receipt for hash: 0x${txHash}`);

//     const receipt = await Client.getReceipt(peer, txHash);

//     if (receipt === null) {
//         console.log("Transaction was not forged.");
//         return;
//     }

//     if (receipt.status === "0x0") {
//         console.log("Transaction failed:");
//     } else {
//         console.log("Transaction succeeded:");
//     }

//     console.log(receipt);
// };
