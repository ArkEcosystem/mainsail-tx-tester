import { http } from "@mainsail/utils";
import { injectable, inject } from "@mainsail/container";
import { EthViewParameters, Receipt, Client as IClient, Config } from "./types.js";
import { AppIdentifiers } from "./identifiers.js";

@injectable()
export class Client implements IClient {
    @inject(AppIdentifiers.Config)
    protected config!: Config;

    public async getWalletNonce(address: string): Promise<number> {
        return parseInt(await this.#JSONRPCCall<string>("eth_getTransactionCount", [address, "latest"]));
    }

    public async getHeight(): Promise<number> {
        return parseInt(await this.#JSONRPCCall<string>("eth_blockNumber", []));
    }

    public async ethCall(viewParameters: EthViewParameters): Promise<string> {
        return this.#JSONRPCCall<string>("eth_call", [viewParameters, "latest"]);
    }

    public async postTransaction(transaction: string): Promise<string> {
        return this.#JSONRPCCall<string>("eth_sendRawTransaction", [`0x${transaction}`]);
    }

    public async getReceipt(transaction: string): Promise<Receipt | null> {
        return this.#JSONRPCCall<Receipt | null>("eth_getTransactionReceipt", [`0x${transaction}`]);
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

    async #JSONRPCCall<T>(method: string, params: any[]): Promise<T> {
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
