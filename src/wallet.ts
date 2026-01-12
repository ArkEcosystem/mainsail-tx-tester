import { injectable, inject, tagged } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";

import { AppIdentifiers } from "./identifiers.js";
import { Config, Client, Wallet as IWallet } from "./types.js";

@injectable()
export class Wallet implements IWallet {
    @inject(AppIdentifiers.Client)
    private client!: Client;

    @inject(AppIdentifiers.Config)
    private config!: Config;

    @tagged("type", "wallet")
    @inject(Identifiers.Cryptography.Identity.Address.Factory)
    private readonly addressFactory!: Contracts.Crypto.AddressFactory;

    @tagged("type", "wallet")
    @inject(Identifiers.Cryptography.Identity.KeyPair.Factory)
    private readonly keyPairFactory!: Contracts.Crypto.KeyPairFactory;

    #nonce?: number;

    public async getAddress(): Promise<string> {
        if (this.config.privateKey !== "") {
            const keyPair = await this.keyPairFactory.fromPrivateKey(Buffer.from(this.config.privateKey, "hex"));
            return this.addressFactory.fromPublicKey(keyPair.publicKey);
        }

        return this.addressFactory.fromMnemonic(this.config.senderPassphrase);
    }

    public async getNonce(): Promise<number> {
        const walletAddress = await this.getAddress();

        // Nonce was already fetched
        if (this.#nonce !== undefined) {
            return this.#nonce;
        }

        this.#nonce = 0;
        try {
            this.#nonce = await this.client.getWalletNonce(walletAddress);
        } catch (e) {}

        console.log(`Using wallet: ${walletAddress} nonce: ${this.#nonce}`);

        return this.#nonce;
    }

    public async getKeyPair(): Promise<Contracts.Crypto.KeyPair> {
        if (this.config.privateKey !== "") {
            return this.keyPairFactory.fromPrivateKey(Buffer.from(this.config.privateKey, "hex"));
        }

        return this.keyPairFactory.fromMnemonic(this.config.senderPassphrase);
    }

    public hasSecondPassphrase(): boolean {
        return this.config.senderSecondPassphrase !== "";
    }

    public getSecondPassphrase(): string {
        return this.config.senderSecondPassphrase;
    }
}
