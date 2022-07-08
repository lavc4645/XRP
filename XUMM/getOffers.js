const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0');

const getOffers = async () => {
    const standby_wallet = xrpl.Wallet.fromSecret('sncVUL2SeJyn1TNyHmDqeNQ3C8L9p')
    console.log(standby_wallet)

    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    const nfts = await client.request({
        method: "account_nfts",
        account: "rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU"
    })

    console.log("NFT list:\n",nfts.result.account_nfts)

    let nftokenId = nfts.result.account_nfts[0].NFTokenID
    
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

    client.disconnect()
}
getOffers()