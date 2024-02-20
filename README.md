# Core Tx Tester

## Installation

-   `pnpm i`
-   `pnpm run build`

## Usage

Show help:

-   `pnpm run start`

Send TX:

-   `pnpm run start <TX number>`

## Configuration

Look into `/config/config.js` file.

Provide correct **peer** data that have enabled Public API and Transaction Pool API.

Default configuration is using testnet from [Mainsail Network Config](https://github.com/ArkEcosystem/mainsail-network-config/tree/main/testnet/mainsail). Use correct **plugins** and **crypto** that is used in the `app.json` and `crypto.json` on the target network.

Adjust `senderPassphrase` and transaction data (recipientId, fee, amount) before sending TX.

## Note

TX Sender is using the Public API to obtain the wallet nonce and Transaction Pool API to send the transaction. Make sure that target node have both APIs enabled.

## Check transactions

-   `curl --location --request GET 'http://127.0.0.1:4003/api/transactions?senderId=DCzk4aCBCeHTDUZ3RnkiK8aqpYYZ9iC51W'`
