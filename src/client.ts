import { httpie } from "@arkecosystem/core-utils";
import { Peer } from "./types";

export const getWalletNonce = async (peer: Peer, walletAddress: string): Promise<string> => {
    try {
        const response = await httpie.get(`${getServerUrl(peer)}/api/wallets/${walletAddress}`);
        return response.body.data.nonce;
    } catch (err) {
        console.error(`Cannot find wallet by address ${walletAddress}: ${err.message}`);
        throw err;
    }
};

const getServerUrl = (peer: Peer): string => {
    return `${peer.protocol}://${peer.ip}:${peer.port}`;
};
