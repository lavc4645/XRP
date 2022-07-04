const { XummSdk } = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')
// const signIn = require("./signin")

const main = async () => {

    // Connecting with the application which we made on developer console
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    // const standby_wallet = xrpl.Wallet.fromSecret('spoB7AHfzTqbg1ihY4aGJiGSFwsR4')
    // console.log("Wallet details", standby_wallet)


    // Connection with "XRPL" client
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()


    // Converting the ipfs metadata to hexadecimal format
    const uri = xrpl.convertStringToHex("ipfs://QmRis1Kk2EmoLfJSbxs8SRJC7ohjJdYqTCnrfeNoqUCUpz")
    // console.log("This is our URI for the NFT \n", uri)





    // // creating the payload for MintNFT
    // const request = {

    //     "TransactionType": "NFTokenMint",
    //     "Account": standby_wallet.classicAddress,
    //     "TransferFee": 314,
    //     "NFTokenTaxon": 0,
    //     "Flags": 8,
    //     "Fee": "10",
    //     "URI": uri


    // }

    // Payload for XUMM wallet
    request2 = {
        "txjson": {
            "TransactionType": "NFTokenMint",
            "Account":"rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU",
            "TransferFee": 314,
            "NFTokenTaxon": 0,
            "Flags": 8,
            "Fee": "10",
            "URI": uri
        },
        "user_token" : "47313f40-d477-4427-b4d3-edd8e5fd227b"
    }

    const subscription = await Sdk.payload.createAndSubscribe(request2, event => {
        console.log('New payload event:', event.data)

        //  The event data contains a property 'signed' (true or false), return :)
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }

    })


    console.log('New payload created,URL:', subscription.created.next.always)
    console.log('  > Pushed:', subscription.created.pushed ? 'yes' : 'no')


    // wait the js engine untill the subscription payload is resolved
    const resolveData = await subscription.resolved
    if (resolveData.signed === false) {
        console.log(' The sign request was rejected :(')
    } else {
        console.log('Woohoo! The sign request was signed :)')

        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        console.log('On ledger TX hash:', result.response.txid)
    }


    // // NFT minting
    // console.log(standby_wallet);
    // const tx = await client.submitAndWait(request, { wallet: standby_wallet })
    // console.log(tx);
    
    // get NFT token
    const nfts = await client.request({
        method: "account_nfts",
        account: "rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU"
    })


    // console.log("transaction data ", tx.result.meta.TransactionResult, + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
    console.log('json', JSON.stringify(nfts, null, 2))
    // console.log("Total NFT Details: ", nfts.result, + "\n\n\n\n\n\n\n\n")


    const balance = await client.getXrpBalance("rUJtFGWStK7g8NwrNqG4WW6YvuTD5VQecU")
    console.log("Balance", balance)
    client.disconnect()

}

main()


