import { http } from "@mainsail/utils";
import { Peer, EthViewParameters, Receipt } from "./types.js";

export class Client {
    public async getWalletNonce(peer: Peer, address: string): Promise<number> {
        return parseInt(await this.#JSONRPCCall<string>(peer, "eth_getTransactionCount", [address, "latest"]));
    }

    public async getHeight(peer: Peer): Promise<number> {
        return parseInt(await this.#JSONRPCCall<string>(peer, "eth_blockNumber", []));
    }

    public async ethCall(peer: Peer, viewParameters: EthViewParameters): Promise<string> {
        return this.#JSONRPCCall<string>(peer, "eth_call", [viewParameters, "latest"]);
    }

    public async postTransaction(peer: Peer, transaction: string): Promise<string> {
        return this.#JSONRPCCall<string>(peer, "eth_sendRawTransaction", [`0x${transaction}`]);
    }

    public async getReceipt(peer: Peer, transaction: string): Promise<Receipt | null> {
        return this.#JSONRPCCall<Receipt | null>(peer, "eth_getTransactionReceipt", [`0x${transaction}`]);
    }

    async #parseJSONRPCResult<T>(method: string, response: any): Promise<T> {
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
    }

    async #JSONRPCCall<T>(peer: Peer, method: string, params: any[]): Promise<T> {
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

            return this.#parseJSONRPCResult<T>(method, response);
        } catch (err) {
            // console.error(`Error on ${method}. ${err.message}`);
            throw err;
        }
    }
}
