import { Interfaces, Transactions } from "@arkecosystem/crypto";
import { Transfer } from "./types";

export const makeTransfer = (passphrase: string, nonce: number, transferData: Transfer): Interfaces.ITransaction => {
    const builder = Transactions.BuilderFactory.transfer();

    return builder
        .recipientId(transferData.recipientId)
        .amount(transferData.amount)
        .fee(transferData.fee)
        .vendorField(transferData.vendorField)
        .nonce(`${nonce + 1}`)
        .sign(passphrase)
        .build();
};
