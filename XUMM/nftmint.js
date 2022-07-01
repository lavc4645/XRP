const {XummSdk} = require('xumm-sdk')
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')




const main = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

// const request = {
//     "TransactionType": "SignIn",
    
// }

const request = {
  "TransactionType": "NFTokenMint",
  "Account": "rni8M5tmDa2jYW7nw3rb2PqTmekAvhzoqU",
//   "Issuer": "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
  "TransferFee": 314,
  "NFTokenTaxon": 0,
  "Flags": 8,
  "Fee": "10",
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Memos": [
        {
            "Memo": {
                "MemoType":
                  "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                "MemoData": "72656E74"
            }
        }
    ]
}


const subscription = await Sdk.payload.createAndSubscribe(request,event => {
    console.log("event response code",event.data);
    

    // it is used to hold the node untill the request get signed
    if (Object.keys(event).indexOf('signed') > -1) {
       return event;
    }
})

console.log(subscription.created);
}
main()