const {XummSdk} = require('xumm-sdk')
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')


const main = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    const request = {
        "txjson": {
        "TransactionType": "Payment",
        "Destination": "rni8M5tmDa2jYW7nw3rb2PqTmekAvhzoqU",
        "Amount": "100",
        
    },
    "user_token": "47313f40-d477-4427-b4d3-edd8e5fd227b"
}

const subscription = await Sdk.payload.createAndSubscribe(request, event =>{
    console.log('New payload event:', event.data)

    //  The event data contains a property 'signed' (true or false), return :)
    if (Object.keys(event.data).indexOf('signed') > -1) {
        return event.data
    }

})

console.log('New payload created,URL:', subscription.created.next.always)
console.log('  > Pushed:', subscription.created.pushed ? 'yes' : 'no')


const resolveData = await subscription.resolved

// (resolveData.signed)? console.log('Woohoo! The sign request was signed :)') : console.log(' The sign request was rejected :(');
if (resolveData.signed === false) {
    console.log(' The sign request was rejected :(')
} else {
    console.log('Woohoo! The sign request was signed :)')

 const result = await Sdk.payload.get(resolveData.payload_uuidv4)
 console.log('On ledger TX hash:', result.response.txid)
}


}

main()








