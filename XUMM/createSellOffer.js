const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0');

const createSellOffer = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const standby_wallet = xrpl.Wallet.fromSecret('spoB7AHfzTqbg1ihY4aGJiGSFwsR4')

    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    // getting the nft details
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })

    // generating the tokenId
    let nftokenId = nfts.result.account_nfts[0].NFTokenID
    console.log(nftokenId)

    const request = {
        "txjson": {
            "TransactionType": "NFTokenCreateOffer",
            "Account": standby_wallet.classicAddress,
            "NFTokenID": nftokenId,
            "Amount": "1000000",
            "Flags": 1    // sell Offer
        },
        "user_token": "47313f40-d477-4427-b4d3-edd8e5fd227b"
    }
    // push notification
    const subscription = await Sdk.payload.createAndSubscribe(request, event => {
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

    client.disconnect()
}
createSellOffer()