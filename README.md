# Mainsail Tx Tester

![Logo](banner.png)

## Prerequisites

Ensure that you have a working `python` binary in your PATH as this script compiles native crypto bindings (specifically https://github.com/ChainSafe/blst-ts will cause you issues). If you notice that you run into an error while installing the dependencies and one of the lines in the stack trace includes `/bin/sh: python: command not found`, this is your issue. A [known scenario](https://github.com/ChainSafe/blst-ts/issues/87) where this happens is on later macOS versions where only a `python3` binary is present.

To resolve it, make sure `python` is available on your system. One way to easily manage this is by using a Python version manager such as [`pyenv`](https://github.com/pyenv/pyenv).

## Setup

```bash
git clone https://github.com/ArkEcosystem/mainsail-tx-tester.git
cd mainsail-tx-tester
pnpm i
pnpm run build
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

Send transfer:

```bash
pnpm run start 1 <address (optional)> <amount (optional)>
```

Show contract options:

```bash
pnpm run start <contract_id>
```

Interact with contract:

```bash
pnpm run start <contract_id> <function_id> <address (optional)> <amount (optional)>
```

Generate wallets **Mnemonic**, **Address** and **Public Key**:

```bash
pnpm run wallet
```

```bash
pnpm run wallet "custom mnemonic"
```

Generate validator **Private**- and **Public Key**:

```bash
pnpm run validator
```

```bash
pnpm run validator "custom mnemonic"
```

Generate fixtures

```bash
pnpm run fixtures
```

Fixtures can be configured in `config/fixtures.js`. They defaults are used for generating fixtures for our test suites. For fixtures with a second signature, please first set `senderSecondPassphrase` before generating the fixtures.

## Contracts

**Build contract from solidity**

```bash
pnpm run build-contract test.sol
```

You can also use contract build from other sources. Just make sure that you include them in builds and format matches other \*.json files .

**Prepare contract for tester**

```bash
pnpm run prepare-contract Test.json
```

## Configuration

Look into `/config/config.js` file.

Provide correct **peer** data that have enabled Public API and Transaction Pool API.

Default configuration is using testnet from [Mainsail Network Config](https://github.com/ArkEcosystem/mainsail-network-config/tree/main/testnet/mainsail). Use correct **plugins** and **crypto** that is used in the `app.json` and `crypto.json` on the target network.

Adjust `senderPassphrase` and transaction data (recipientId, fee, amount) before sending TX. If you want to use an address with a second signature registered, make sure to set `senderSecondPassphrase` in addition!

## Note

TX Sender is using the ETH JSON_RPC API to obtain the wallet nonce and to send the transaction. Make sure that target node have API enabled.

## Check transactions

```bash
curl --location --request GET 'http://127.0.0.1:4003/api/transactions?senderId=DCzk4aCBCeHTDUZ3RnkiK8aqpYYZ9iC51W'
```
