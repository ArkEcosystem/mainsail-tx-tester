import * as Loader from "./loader";
import * as Client from "./client";
import * as Builder from "./builder";

const main = async () => {
    const config = Loader.loadConfig();
    const peer = config.cli.peer;

    const latestHeight = await Client.getHeight(peer);
    console.log(`>> latest height: ${latestHeight}`);

    const tx = await Builder.makeTransfer(
        config,
    );

    await Client.postTransaction(peer, tx.serialized.toString("hex"));
    console.log(`>> sent tx ${tx.id} to ${peer.ip}`);
};

main();
