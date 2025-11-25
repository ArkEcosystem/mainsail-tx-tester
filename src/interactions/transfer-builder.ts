import { injectable, inject, tagged } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { AppIdentifiers } from "../identifiers.js";
import { Config, Client, TransferBuilder as ITransferBuilder } from "../types.js";
import { TransactionBuilder } from "@mainsail/crypto-transaction";

@injectable()
export class TransferBuilder implements ITransferBuilder {
    @inject(Identifiers.Application.Instance)
    private readonly app!: Contracts.Kernel.Application;

    @tagged("type", "wallet")
    @inject(Identifiers.Cryptography.Identity.Address.Factory)
    private readonly addressFactory!: Contracts.Crypto.AddressFactory;

    @tagged("type", "wallet")
    @inject(Identifiers.Cryptography.Identity.KeyPair.Factory)
    private readonly keyPairFactory!: Contracts.Crypto.KeyPairFactory;

    public async makeTransfer(
        config: Config,
        recipient?: string,
        amount?: string,
    ): Promise<Contracts.Crypto.Transaction> {
        const { transfer } = config;

        const walletNonce = await this.getWalletNonce(config);

        let builder = this.app
            .resolve(TransactionBuilder)
            .gasPrice(config.gasPrice)
            .gasLimit(21000)
            .nonce(walletNonce.toFixed(0))
            .recipientAddress(recipient ? recipient : transfer.recipientAddress)
            .value(amount ? amount : transfer.value)
            .payload("");

        const signed = await this.signTransaction(builder, config);

        return signed.build();
    }

    protected async getAddress(config: Config): Promise<string> {
        if (config.privateKey && config.privateKey !== "") {
            const keyPair = await this.keyPairFactory.fromPrivateKey(Buffer.from(config.privateKey, "hex"));

            return this.addressFactory.fromPublicKey(keyPair.publicKey);
        }

        return this.addressFactory.fromMnemonic(this.app.get(AppIdentifiers.WalletPassphrase));
    }

    protected async getWalletNonce(config: Config): Promise<number> {
        const { peer } = config;

        const walletAddress = await this.getAddress(config);

        if (this.app.isBound(AppIdentifiers.WalletNonce)) {
            return this.app.get<number>(AppIdentifiers.WalletNonce);
        }

        let walletNonce = 0;
        try {
            walletNonce = await this.app.get<Client>(AppIdentifiers.Client).getWalletNonce(peer, walletAddress);
        } catch (e) {}

        console.log(`Using wallet: ${walletAddress} nonce: ${walletNonce}`);

        return walletNonce;
    }

    protected async signTransaction(builder: TransactionBuilder, cli: any): Promise<TransactionBuilder> {
        if (cli.privateKey && cli.privateKey !== "") {
            const keyPair = await this.keyPairFactory.fromPrivateKey(Buffer.from(cli.privateKey, "hex"));

            return builder.signWithKeyPair(keyPair);
        }

        let signed = await builder.sign(this.app.get(AppIdentifiers.WalletPassphrase));

        // if second passphrase is set, sign again
        if (cli.senderSecondPassphrase && cli.senderSecondPassphrase !== "") {
            signed = await signed.legacySecondSign(cli.senderSecondPassphrase);
        }

        return signed;
    }
}
