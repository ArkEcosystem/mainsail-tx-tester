import { http } from "../../mainsail/packages/utils";
import { Contracts } from "../../mainsail/packages/contracts";
import { Peer } from "./types";

export const getWalletNonce = async (peer: Peer, walletAddress: string): Promise<number> => {
    try {
        const response = await http.get(`${getApiServerUrl(peer)}/api/wallets/${walletAddress}`);
        return parseInt(response.data.nonce);
    } catch (err) {
        console.error(`Cannot find wallet by address ${walletAddress}: ${err.message}`);
        throw err;
    }
};

export const getHeight = async (peer: Peer): Promise<number> => {
    try {
        const response = await http.get(`${getApiServerUrl(peer)}/api/blockchain`);
        return parseInt(response.data.data.block.height);
    } catch (err) {
        console.error(`Cannot get height: ${err.message}`);
        throw err;
    }
};

export const postTransaction = async (peer: Peer, transaction: Contracts.Crypto.ITransactionData): Promise<void> => {
    try {
        const response = await http.post(`${getApiTxPoolServerUrl(peer)}/api/transaction-pool`, {
            headers: { "Content-Type": "application/json" },
            body: {
                transactions: [transaction] as any,
            },
        });

        if (response.statusCode !== 200) {
            console.log(JSON.stringify(response.data));

            return response.data;
        } else {
            console.log(`Transaction is sent`);

            return response.data;
        }
    } catch (err) {
        console.error(`Cannot post transaction: ${err.message}`);
    }
};

const getApiServerUrl = (peer: Peer): string => {
    return `${peer.protocol ?? "http"}://${peer.ip}:4003`;
};

const getApiTxPoolServerUrl = (peer: Peer): string => {
    return `${peer.protocol ?? "http"}://${peer.ip}:4007`;
};
