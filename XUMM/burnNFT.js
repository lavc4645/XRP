const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0');
const burn = async () => {

    // Connecting with application
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const standby_wallet = xrpl.Wallet.fromSecret('spoB7AHfzTqbg1ihY4aGJiGSFwsR4')

    // Connection with "XRPL" client
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    // getting nft data
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })
    console.log('json', JSON.stringify(nfts, null, 2))
    console.log(nfts.result.account_nfts[0])


    // Finding the token no 
    const nftokenID = nfts.result.account_nfts[0].NFTokenID
    console.log(" Token Id - ", nftokenID)

    // // creating payload for burnNFT
    // const request = {
    //     "TransactionType": "NFTokenBurn",
    //     "Account": standby_wallet.classicAddress,
    //     "Fee": "10",
    //     "NFTokenID": nftokenID
    // }

    request2 = {
        "txjson": {
            "TransactionType": "NFTokenBurn",
            "Account": standby_wallet.classicAddress,
            "Fee": "10",
            "NFTokenID": nftokenID
        },
        
        "user_token" : "47313f40-d477-4427-b4d3-edd8e5fd227b"
    }

    // push notification
    const subscription = await Sdk.payload.createAndSubscribe(request2, event => {
        console.log('New payload event:', event.data)

        //  The event data contains a property 'signed' (true or false), return :)
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }

    })

    // wait untills the push notification will resolve
    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        console.log(' The sign request was rejected :(')
    } else {
        console.log('Woohoo! The sign request was signed :)')

        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        console.log('On ledger TX hash:', result.response.txid)
    }


    // Burn NFT
    // const tx = await client.submitAndWait(request, { wallet: standby_wallet})
    // console.log("Transaction result: ", tx.result.meta.TransactionResult)

    // // getting nft data
    const nfts2 = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })
    console.log(' Updated json \n\n', JSON.stringify(nfts2, null, 2))
    // console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

    client.disconnect()
}
burn()