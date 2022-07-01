const {XummSdk} = require('xumm-sdk')
const xrpl = require("xrpl");
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')

const main = async () => {

    // Connecting with the application which we made on developer console
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const standby_wallet = xrpl.Wallet.fromSecret('snLGWREShnRcecRo2vAuzbdwYg3TL')
    // console.log("Wallet details", standby_wallet)


    // Connection with "XRPL" client
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()


    // Converting the ipfs metadata to hexadecimal format
    const uri = xrpl.convertStringToHex("ipfs://QmR7AALJaHx8Qv48SCHnHTnqCmB8u7JQiH6qPbELB9ofWD")
    // console.log("This is our URI for the NFT \n", uri)
    
    
    // creating the payload
    const raman = {

        "TransactionType": "NFTokenMint",
        "Account": standby_wallet.classicAddress,
        "TransferFee": 314,
        "NFTokenTaxon": 0,
        "Flags": 8,
        "Fee": "10",
        "URI": uri

      }
      const raman2 = {
        "TransactionType": "NFTokenMint",
        "Account": standby_wallet.classicAddress,
        "TransferFee": 314,
        "NFTokenTaxon": 0,
        "Flags": 8,
        "URI": uri
      }

    // passing the payload to the payload object
    // const payload = await Sdk.payload.create(request, true)
    // console.log("Payload =================================+>\n ", payload)

    const subscription = await Sdk.payload.createAndSubscribe(raman, event =>{
        console.log('New payload event:', event.data)
    
        //  The event data contains a property 'signed' (true or false), return :)
        if (Object.keys(event.data).indexOf('signed') > -1) {
            return event.data
        }
    
    })

    console.log('New payload created,URL:', subscription.created.next.always)
    console.log('  > Pushed:', subscription.created.pushed ? 'yes' : 'no')



    const resolveData = await subscription.resolved

    if (resolveData.signed === false) {
        console.log(' The sign request was rejected :(')
    } else {
        console.log('Woohoo! The sign request was signed :)')
    
     const result = await Sdk.payload.get(resolveData.payload_uuidv4)
     console.log('On ledger TX hash:', result.response.txid)
    }
    console.log(standby_wallet);
    const tx = await client.submitAndWait(raman,{ wallet: standby_wallet})
    console.log(tx);
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    })

    console.log("transaction data \n",tx.result.meta.TransactionResult)
    // console.log('json', J(nfts, null, 2))
    console.log("nft object", nfts)

    const balance = await client.getXrpBalance(standby_wallet.address)
    console.log("Balance",balance)
    client.disconnect()

}
main()


