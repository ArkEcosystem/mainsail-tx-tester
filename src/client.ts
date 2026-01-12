import { http } from "@mainsail/utils";
import { injectable, inject } from "@mainsail/container";
import { EthViewParameters, Receipt, Client as IClient, Config, JSONRPCResponse } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";

@injectable()
export class Client implements IClient {
    @inject(AppIdentifiers.Config)
    protected config!: Config;

    public async getWalletNonce(address: string): Promise<number> {
        const response = await this.#JSONRPCCall<string>("eth_getTransactionCount", [address, "latest"]);
        if (!response.success) {
            throw new Error(`Error getting wallet nonce: ${response.message}`);
        }

        return parseInt(response.result);
    }

    public async getHeight(): Promise<number> {
        const response = await this.#JSONRPCCall<string>("eth_blockNumber", []);
        if (!response.success) {
            throw new Error(`Error getting block number: ${response.message}`);
        }

        return parseInt(response.result);
    }

    public async ethEstimateGas(viewParameters: EthViewParameters): Promise<JSONRPCResponse<string>> {
        return this.#JSONRPCCall<string>("eth_estimateGas", [viewParameters]);
    }

    public async ethCall(viewParameters: EthViewParameters): Promise<JSONRPCResponse<string>> {
        return this.#JSONRPCCall<string>("eth_call", [viewParameters, "latest"]);
    }

    public async postTransaction(transaction: string): Promise<JSONRPCResponse<string>> {
        return this.#JSONRPCCall<string>("eth_sendRawTransaction", [`0x${transaction}`]);
    }

    public async getReceipt(transaction: string): Promise<JSONRPCResponse<Receipt | null>> {
        return this.#JSONRPCCall<Receipt | null>("eth_getTransactionReceipt", [`0x${transaction}`]);
    }

    async #parseJSONRPCResult<T>(method: string, response: any): Promise<JSONRPCResponse<T>> {
        if (response.statusCode !== 200) {
            const error = `Error on ${method}. Status code is ${response.statusCode}`;
            console.error(error);
            throw new Error(error);
        } else if (response.data.error) {
            return {
                success: false,
                code: response.data.error.code,
                message: response.data.error.message,
                data: response.data.error.data,
            };
        }

        return {
            success: true,
            result: response.data.result,
        };
    }

    async #JSONRPCCall<T>(method: string, params: any[]): Promise<JSONRPCResponse<T>> {
        try {
            const response = await http.post(`${this.config.peer}`, {
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
