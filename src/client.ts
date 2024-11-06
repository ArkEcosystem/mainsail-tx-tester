import { http } from "@mainsail/utils";
import { Peer, EthViewParameters } from "./types.js";

export const getWalletNonce = async (peer: Peer, address: string): Promise<number> => {
    const method = "eth_getTransactionCount";

    try {
        const response = await http.post(`${peer.apiEvmUrl}/api/`, {
            headers: { "Content-Type": "application/json" },
            body: {
                jsonrpc: "2.0",
                method,
                params: [address, "latest"],
                id: null,
            },
        });

        return parseInt(parseJSONRPCResult<string>(method, response));
    } catch (err) {
        console.error(`Error on ${method}. ${err.message}`);
        throw err;
    }
};

export const getHeight = async (peer: Peer): Promise<number> => {
    const method = "eth_blockNumber";
    try {
        const response = await http.post(`${peer.apiEvmUrl}/api/`, {
            headers: { "Content-Type": "application/json" },
            body: {
                jsonrpc: "2.0",
                method,
                params: [],
                id: null,
            },
        });

        return parseInt(parseJSONRPCResult<string>(method, response));
    } catch (err) {
        console.error(`Error on ${method}. ${err.message}`);
        throw err;
    }
};

const parseJSONRPCResult = <T>(method: string, response: any): T => {
    if (response.statusCode !== 200) {
        const error = `Error on ${method}. Status code is ${response.statusCode}`;
        console.error(error);
        throw new Error(error);
    } else if (response.data.error) {
        const error = `Error on ${method}. Error code: ${response.data.error.code}, message: ${response.data.error.message}`;
        console.error(error);
        throw new Error(error);
    }

    return response.data.result;
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

export const postEthView = async (peer: Peer, viewParameters: EthViewParameters): Promise<{ result: string }> => {
    try {
        const response = await http.post(`${peer.apiEvmUrl}/api/`, {
            headers: { "Content-Type": "application/json" },
            body: {
                jsonrpc: "2.0",
                method: "eth_call",
                params: [viewParameters, "latest"],
                id: null,
            },
        });

        if (response.statusCode !== 200) {
            console.log(JSON.stringify(response.data));

            return response.data;
        } else {
            return response.data;
        }
    } catch (err) {
        console.error(`Cannot post ethView: ${err.message}`);
        throw err;
    }
};
