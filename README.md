# Mainsail Tx Tester

![Logo](banner.png)

## Yarn

### Installation

```bash
yarn
yarn build
```

### Usage

Show help:

```bash
yarn start
```

Send TX:

```bash
yarn start <TX number>
```

Generate wallets **Mnemonic**, **Address** and **Public Key**:

```bash
yarn wallet
```

```bash
yarn wallet "custom mnemonic"
```

## PNPM

### Installation

```bash
pnpm i
pnpm run build
```

### Usage

Show help:

```bash
pnpm run start
```

Send TX:

```bash
pnpm run start <TX number>
```

Generate wallets **Mnemonic**, **Address** and **Public Key**:

```bash
pnpm run wallet
```

```bash
pnpm run wallet "custom mnemonic"
```

## Configuration

Look into `/config/config.js` file.

Provide correct **peer** data that have enabled Public API and Transaction Pool API.

Default configuration is using testnet from [Mainsail Network Config](https://github.com/ArkEcosystem/mainsail-network-config/tree/main/testnet/mainsail). Use correct **plugins** and **crypto** that is used in the `app.json` and `crypto.json` on the target network.

Adjust `senderPassphrase` and transaction data (recipientId, fee, amount) before sending TX.

## Note

TX Sender is using the Public API to obtain the wallet nonce and Transaction Pool API to send the transaction. Make sure that target node have both APIs enabled.

## Check transactions

```bash
curl --location --request GET 'http://127.0.0.1:4003/api/transactions?senderId=DCzk4aCBCeHTDUZ3RnkiK8aqpYYZ9iC51W'
```
