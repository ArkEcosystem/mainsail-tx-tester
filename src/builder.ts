// @ts-nocheck
import { Interfaces, Transactions } from "@arkecosystem/crypto";
import { Transfer } from "./types";

export const makeTransfer = async (passphrase: string, transferData: Transfer): Promise<void> => {
    const builder = Transactions.BuilderFactory.transfer();
};
