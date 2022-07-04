const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0');

const createBuyOffer = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const standby_wallet = xrpl.Wallet.fromSecret('snLyXS2F1feCdXzM6zqCQ9ZCBWie2')

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
        "TransactionType": "NFTokenCreateOffer",
        "Account": standby_wallet.classicAddress,
        "NFTokenID": nftokenId,
        "Amount": "10000",
        "Flags": 0
    }

    const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet })

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



    console.log("Transaction result:",
        JSON.stringify(tx.result.meta.TransactionResult, null, 2))
    console.log("Balance changes:",
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

    client.disconnect()
}
createBuyOffer()