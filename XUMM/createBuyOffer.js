const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0');

const createBuyOffer = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const standby_wallet = xrpl.Wallet.fromSecret('sncVUL2SeJyn1TNyHmDqeNQ3C8L9p')

    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    // getting the nft details
    const nfts = await client.request({
        method: "account_nfts",
        account: "rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU"
    })

    // generating the tokenId
    let nftokenId = nfts.result.account_nfts[0].NFTokenID
    console.log(nftokenId)


    const transactionBlob = {
        "txjson": {
            "TransactionType": "NFTokenCreateOffer",
            "Account": standby_wallet.classicAddress,
            "Owner":"rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU",
            "NFTokenID": nftokenId,
            "Amount": "1000",
            "Fee": "10",
            "Flags": 0    // buy Offer
        },
        "user_token": "47313f40-d477-4427-b4d3-edd8e5fd227b"
    }


    // const transactionBlob = {
    //     "TransactionType": "NFTokenCreateOffer",
    //     "Account": standby_wallet.classicAddress,
    //     "Owner": "rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU",
    //     "NFTokenID": nftokenId,
    //     "Amount": "1000",
    //     "Flags": 0    // buy Offer
    // }

    // push notification
    const subscription = await Sdk.payload.createAndSubscribe(transactionBlob, event => {
        console.log('New payload event:', event.data)

        //  The event data contains a property 'signed' (true or false), return :)
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }

    })
    console.log("QR-Code",subscription.created.next)

    // wait untills the push notification will resolve
    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        console.log(' The sign request was rejected :(')
    } else {
        console.log('Woohoo! The sign request was signed :)')

        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        console.log('On ledger TX hash:', result.response.txid)
    }

    // const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet })

    /**
    * ****Sell Offers****
    */

    console.log("***Sell Offers***")
    let nftSellOffers
    try {
        nftSellOffers = await client.request({
            method: "nft_sell_offers",
            nft_id: nftokenId
        })
    } catch (err) {
        console.log("No sell offers")
    }
    console.log(JSON.stringify(nftSellOffers, null, 2))

    /**
     * ****Buy Offers****
     */
     console.log("***Buy Offers***")
    let nftBuyOffers
    try {
        nftBuyOffers = await client.request({
            method: "nft_buy_offers",
            nft_id: nftokenId
        })
    } catch (err) {
        console.log("No Buy offers.")
    }

    console.log(JSON.stringify(nftBuyOffers, null, 2))



    // console.log("Transaction result:",
    //     JSON.stringify(tx.result.meta.TransactionResult, null, 2))
    // console.log("Balance changes:",
    //     JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

    client.disconnect()
}
createBuyOffer()