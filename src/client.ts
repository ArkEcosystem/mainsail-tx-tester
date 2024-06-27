import { http } from "@mainsail/utils";
import { Peer, EthViewParameters } from "./types.js";

export const getWalletNonce = async (peer: Peer, address: string): Promise<number> => {
    try {
        const response = await http.get(`${peer.apiUrl}/api/wallets/${address}`);
        const nonce = response.data.nonce ?? response.data.data.nonce ?? "0";
        return parseInt(nonce);
    } catch (err) {
        console.error(`Cannot find wallet by address ${address}: ${err.message}`);
        throw err;
    }
};

export const getHeight = async (peer: Peer): Promise<number> => {
    try {
        const response = await http.get(`${peer.apiUrl}/api/blockchain`);
        return parseInt(response.data.data.block.height);
    } catch (err) {
        console.error(`Cannot get height: ${err.message}`);
        throw err;
    }
};

export const postTransaction = async (peer: Peer, transaction: string): Promise<void> => {
    try {
        const response = await http.post(`${peer.apiTxPoolUrl}/api/transactions`, {
            headers: { "Content-Type": "application/json" },
            body: {
                transactions: [transaction] as any,
            },
        });

        if (response.statusCode !== 200) {
            console.log(JSON.stringify(response.data));

            return response.data;
        } else {
            return response.data;
        }
    } catch (err) {
        console.error(`Cannot post transaction: ${err.message}`);
    }
};

export const postEthView = async (peer: Peer, viewParameters: EthViewParameters): Promise<void> => {
    try {
        const response = await http.post(`${peer.apiEvmUrl}/api/`, {
            headers: { "Content-Type": "application/json" },
            body: {
                jsonrpc:"2.0",
                method:"eth_call",
                params:
                    [
                        viewParameters, 
                        "latest"
                    ],
                id: null
            }
        });

        if (response.statusCode !== 200) {
            console.log(JSON.stringify(response.data));

            return response.data;
        } else {
            return response.data;
        }
    } catch (err) {
        console.error(`Cannot post ethView: ${err.message}`);
    }
};