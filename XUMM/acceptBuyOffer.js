const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0');

const acceptBuyOffer = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const standby_wallet = xrpl.Wallet.fromSecret('sncVUL2SeJyn1TNyHmDqeNQ3C8L9p')

    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()
    console.log("Connected to Devnet")

    const transactionBlob = {
        "txjson": {
            "TransactionType": "NFTokenAcceptOffer",
            "Account": "rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU",
            "NFTokenBuyOffer": "D9E1C44F321FF4E5D0FA479385D1772BFE617BEB065E77D2F824B5270648CB74",
        },
        "user_token": "47313f40-d477-4427-b4d3-edd8e5fd227b"
    }

     // push notification
     const subscription = await Sdk.payload.createAndSubscribe(JSON.stringify(transactionBlob), event => {
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
        console.log('On ledger TX hash:', result)
    }

    // getting the nft details
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })
    console.log(JSON.stringify(nfts.result.account_nfts,null,2))

    client.disconnect()
}
acceptBuyOffer()