const xrpl = require("xrpl");


async function main(){

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()


    // //  Create a wallet and fund it with the Testnet faucet;
    // const fund_result = await client.fundWallet();
    // const test_wallet = fund_result.wallet;
    // console.log(fund_result)

    const standby_wallet = xrpl.Wallet.fromSecret('shM7dTX1gvmTqpmMX7TJRUht6DLMR')
    console.log(standby_wallet)


    // Get info from the ledger about the address we just funded
    // const response = await client.request({
    //     "command": "account_info",
    //     "account": "rHqjcvgDtH8qCR9uQcBxeiJmdpjvgsVKAx",
    //     "ledger_index": "validated"
    // })
    // console.log(response);



    // // Listen to ledger close events
    //     client.request({
    //         "command": "subscribe",
    //         "streams": ["ledger"]
    //     })
    //     client.on("ledgerClosed", async (ledger) =>)

    
    client.disconnect()
}

main()