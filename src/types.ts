export type Config = {
    peer: Peer;
    transfer: Transfer;
    senderPassphrase: string;
};

export type Peer = {
    ip: string;
    port: number;
    protocol: string;
};

export type Transfer = {
    recipientId: string;
    fee: string;
    amount: string;
    vendorField: string;
};
