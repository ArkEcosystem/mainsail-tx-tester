const main = async () => {
    if (process.argv.length !== 3) {
        console.log("Please provide a wallet mnemonic as first argument");
        return;
    }

    const mnemonic = process.argv[2];

    console.log("Mnemonic: ", mnemonic);
};

main();
