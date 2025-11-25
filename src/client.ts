import { http } from "@mainsail/utils";
import { Peer, EthViewParameters, Receipt } from "./types.js";

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

const JSONRPCCall = async <T>(peer: Peer, method: string, params: any[]): Promise<T> => {
    try {
        const response = await http.post(`${peer}`, {
            headers: { "Content-Type": "application/json" },
            body: {
                jsonrpc: "2.0",
                method,
                params,
                id: null,
            },
        });

        return parseJSONRPCResult<T>(method, response);
    } catch (err) {
        // console.error(`Error on ${method}. ${err.message}`);
        throw err;
    }
};

export const getWalletNonce = async (peer: Peer, address: string): Promise<number> => {
    return parseInt(await JSONRPCCall<string>(peer, "eth_getTransactionCount", [address, "latest"]));
};

export const getHeight = async (peer: Peer): Promise<number> => {
    return parseInt(await JSONRPCCall<string>(peer, "eth_blockNumber", []));
};

export const ethCall = async (peer: Peer, viewParameters: EthViewParameters): Promise<string> => {
    return JSONRPCCall<string>(peer, "eth_call", [viewParameters, "latest"]);
};

export const postTransaction = async (peer: Peer, transaction: string): Promise<string> => {
    return JSONRPCCall<string>(peer, "eth_sendRawTransaction", [`0x${transaction}`]);
};

export const getReceipt = async (peer: Peer, transaction: string): Promise<Receipt | null> => {
    return JSONRPCCall<Receipt | null>(peer, "eth_getTransactionReceipt", [`0x${transaction}`]);
};
