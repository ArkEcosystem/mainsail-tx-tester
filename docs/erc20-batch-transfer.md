# ERC20 Batch Transfer

You can transfer any ERC20 token to one or more recipients in a single transaction. To do this, you will use a helper contract
which got approval from the token owner to transfer out funds to one or more recipients.

Follow this basic step-by-step guide to batch transfer ERC20 tokens:

## Prepare ERC20BatchTransfer contract

- Deploy a copy of the ERC20BatchTransfer contract with
`pnpm run start 9 0`

- Grab contract address from logs and replace the `contractId` in `erc20batchtransfer.js`

## Prepare one or more ERC20 contracts

- Deploy one or more ERC20 contracts with `pnpm run start 6 0`

- Batch transfer requires the token address, recipients, amounts and prior approval to move tokens on behalf of the sender.

- Update `dark20.js` with a deployed ERC20 contract address and call `approve` with the approval receiver being the `ERC20BatchTransfer` contract.

- You can call `approve` with `pnpm run start 6 2` (if you change the default amount, make sure it matches the actual amounts you will transfer further below)


## Execute Batch Transfers

- Update `erc20batchtransfer.js` with the correct ERC20 contract address and recipients/amounts.

E.g. if `0xB78d7D1B9048aFaF50a93D6B435ddf1c34C6AFe2` is your ERC20 address, the config should look like this:

```js
{
    functionName: "batchTransferFrom",
    args: [
        "0xB78d7D1B9048aFaF50a93D6B435ddf1c34C6AFe2", // <- PUT IT HERE
        [
            "0x0000000000000000000000000000000000000001", // Recipient 1
            "0x0000000000000000000000000000000000000002", // Recipient 2
            "0x0000000000000000000000000000000000000003", // Recipient 3
        ], [
            1, // Amount 1
            2, // Amount 2
            3, // Amount 3
        ]
    ],
},
```

- Lastly, call batch transfer with `pnpm run start 9 1`

If successful your logs should contain something like this:

```json
{
  "transactionHash": "0x4746f19eae5fb8978a1891452432167a3e2c17b755da88e811123258112148c9",
  "transactionIndex": "0x0",
  "blockHash": "0xccbefadf5e153729e53cbc8993c4fd8986d6a8fae4bfa8bd57901819814a5035",
  "blockNumber": "0x513",
  "from": "0x432b093d9542B905C87587607491C369408475b4",
  "to": "0x0f6B0a8a50E12b554ceb20e909d3F627A1DCC3F6",
  "cumulativeGasUsed": "0x0",
  "effectiveGasUsed": "0x0",
  "gasUsed": "0x1d7ca",
  "logs": [
    {
      "address": "0xb78d7d1b9048afaf50a93d6b435ddf1c34c6afe2",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000432b093d9542b905c87587607491c369408475b4",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000001"
    },
    {
      "address": "0xb78d7d1b9048afaf50a93d6b435ddf1c34c6afe2",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000432b093d9542b905c87587607491c369408475b4",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000002"
    },
    {
      "address": "0xb78d7d1b9048afaf50a93d6b435ddf1c34c6afe2",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000432b093d9542b905c87587607491c369408475b4",
        "0x0000000000000000000000000000000000000000000000000000000000000003"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000003"
    }
  ],
  "logsBloom": "0x04000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020400000000000000040000000000000000000000000008000000000000000000040000000000000000000000000000200000000000000020000000000000100000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000100000000000000000000800000000000000000400000000002000000000000000000000000000000000000000000000000000040000000000040000000000000000000000000000000008000000000000000000000",
  "type": "0x0",
  "status": "0x1"
}
````