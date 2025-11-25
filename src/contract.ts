import { Contracts, Identifiers } from "@mainsail/contracts";
import { injectable, inject } from "@mainsail/container";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

import { ContractData, Config, Client, Contract as IContract, Wallet } from "./types.js";
import * as Builder from "./builder.js";
import { AppIdentifiers } from "./identifiers.js";

@injectable()
export class Contract implements IContract {
    @inject(Identifiers.Application.Instance)
    private app!: Contracts.Kernel.Application;

    @inject(AppIdentifiers.Wallet)
    private readonly wallet!: Wallet;

    @inject(AppIdentifiers.Config)
    private config!: Config;

    private contractData!: ContractData;

    public init(contractData: ContractData): Contract {
        this.contractData = contractData;
        return this;
    }

    list(): void {
        this.#logContract();
        // Deploys:
        console.log("Deploys:");
        this.#logLine();
        console.log(`0 - Deploy`);
        this.#logLine();

        // Transactions:
        console.log("Transactions:");
        this.#logLine();
        let i = 1;
        for (let transaction of this.contractData.transactions) {
            console.log(`${i++} - ${transaction.functionName}`);
        }
        this.#logLine();

        // Views:
        console.log("Views:");
        this.#logLine();

        for (let view of this.contractData.views) {
            console.log(`${i++} - ${view.functionName}`);
        }
    }

    async interact(transactionIndex: number, args?: any, amount?: string): Promise<string | void> {
        if (transactionIndex === 0) {
            return await this.#deploy();
        }

        transactionIndex--; // Adjust for deploy at index 0
        if (transactionIndex < this.contractData.transactions.length) {
            return await this.#transaction(transactionIndex, args, amount);
        } else if (transactionIndex < this.contractData.transactions.length + this.contractData.views.length) {
            await this.#view(transactionIndex - this.contractData.transactions.length);
        } else {
            throw new Error("Invalid index");
        }
    }

    async makeEvmDeploy(contractData: ContractData): Promise<Contracts.Crypto.Transaction> {
        const walletNonce = await this.wallet.getNonce();

        let builder = this.app
            .resolve(TransactionBuilder)
            .gasPrice(this.config.gasPrice)
            .payload(contractData.bytecode.slice(2))
            .gasLimit(2_000_000)
            .nonce(walletNonce.toString());

        await builder.signWithKeyPair(await this.wallet.getKeyPair());

        if (this.wallet.hasSecondPassphrase()) {
            builder = await builder.legacySecondSign(this.wallet.getSecondPassphrase());
        }

        return builder.build();
    }

    async #deploy(): Promise<string> {
        this.#logContract();
        const transaction = await this.makeEvmDeploy(this.contractData);
        this.#logLine();

        this.#logLine();
        console.log("Deployment sent: ", `0x${transaction.hash}`);
        await this.app
            .get<Client>(AppIdentifiers.Client)
            .postTransaction(this.config.peer, transaction.serialized.toString("hex"));
        this.#logLine();

        return transaction.hash;
    }

    async #transaction(transactionIndex: number, args?: any, amount?: string): Promise<string> {
        this.#logContract();
        const transaction = await Builder.makeEvmCall(this.config, this.contractData, transactionIndex, args, amount);
        this.#logLine();

        // await this.#simulate(this.config.cli.peer, transaction);

        this.#logLine();
        console.log("Transaction sent: ", `0x${transaction.hash}`);
        await this.app
            .get<Client>(AppIdentifiers.Client)
            .postTransaction(this.config.peer, transaction.serialized.toString("hex"));
        this.#logLine();

        return transaction.hash;
    }

    // @ts-ignore
    #simulate = async (app: Contracts.Kernel.Application, transaction: Contracts.Crypto.Transaction): Promise<void> => {
        console.log("Simulating transaction...");
        const result = await app.get<Client>(AppIdentifiers.Client).ethCall(this.config.peer, {
            from: transaction.data.from,
            to: transaction.data.to!, // TODO: Support to
            data: `0x${transaction.serialized.toString("hex")}`,
            // gas: transaction.data.gasLimit?.toString(),
            // gasPrice: transaction.data.gasPrice?.toString(),
            // value: transaction.data.value?.toString(),
        });

        console.log("Simulation result:");
        console.log(result);
    };

    async #view(viewIndex: number): Promise<void> {
        this.#logContract();
        const view = await Builder.makeEvmView(this.config, this.contractData, viewIndex);
        const result = await this.app.get<Client>(AppIdentifiers.Client).ethCall(this.config.peer, view);
        this.#logLine();
        Builder.decodeEvmViewResult(this.config, this.contractData, viewIndex, result);
        this.#logLine();
    }

    #logContract() {
        this.#logLine();
        console.log(`Contract: ${this.contractData.name}`);
        console.log(`Id: ${this.contractData.contractId}`);
        this.#logLine();
    }

    #logLine() {
        console.log("-".repeat(46));
    }
}
