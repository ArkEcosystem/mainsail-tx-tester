import { httpie } from "@arkecosystem/core-utils";
import { Interfaces } from "@arkecosystem/crypto";
import { Peer } from "./types";

export const getWalletNonce = async (peer: Peer, walletAddress: string): Promise<number> => {
    try {
        const response = await httpie.get(`${getServerUrl(peer)}/api/wallets/${walletAddress}`);
        return parseInt(response.body.data.nonce);
    } catch (err) {
        console.error(`Cannot find wallet by address ${walletAddress}: ${err.message}`);
        throw err;
    }
};

export const getHeight = async (peer: Peer): Promise<number> => {
    try {
        const response = await httpie.get(`${getServerUrl(peer)}/api/blockchain`);
        return parseInt(response.body.data.block.height);
    } catch (err) {
        console.error(`Cannot get height: ${err.message}`);
        throw err;
    }
};

export const postTransaction = async (peer: Peer, transaction: Interfaces.ITransactionData): Promise<void> => {
    try {
        const response = await httpie.post(`${getServerUrl(peer)}/api/transactions`, {
            headers: { "Content-Type": "application/json" },
            body: {
                transactions: [transaction],
            },
        });

        if (response.status !== 200 || response.body.errors) {
            console.log(JSON.stringify(response.body));

            return response.body;
        } else {
            console.log(`Transaction is sent`);

            return response.body;
        }
    } catch (err) {
        console.error(`Cannot post transaction: ${err.message}`);
    }
};

const getServerUrl = (peer: Peer): string => {
    return `${peer.protocol}://${peer.ip}:${peer.port}`;
};
