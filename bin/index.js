const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
    let byCommand = false;
    let byHash = true;
    let data = null;

    if (process.argv.length == 4) {
        const command = process.argv[2];
        const param = process.argv[3];

        if (command == "--number") {
            byHash = false;
            byCommand = true;
            data = param;

        } else if (command == "--hash") {
            byCommand = true;
            data = param;
        }
    }

    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    const chain = await api.rpc.system.chain();

    let header;

    if (byCommand) {
        if (byHash) {
            header = await api.rpc.chain.getHeader(data);
        } else {
            const blockHash = await api.rpc.chain.getBlockHash(data);
            header = await api.rpc.chain.getHeader(blockHash);
        }
    } else {
        header = await api.rpc.chain.getHeader();
    }

    const parentHash = header.parentHash.toHuman();
    
    console.log(`Chain: ${chain}`);
    console.log(`Block #${header.number}, ${header.hash}`);
    console.log(`State root:\n\t${header.stateRoot}`);
    console.log(`Extrinsics Root:\n\t${header.extrinsicsRoot}`);
    console.log(`Parent hash:\n\t${parentHash}`);

    process.exit();
}

main();