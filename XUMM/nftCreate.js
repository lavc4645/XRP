const {XummSdk} = require('xumm-sdk')
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')




const main = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

const request = {
    "TransactionType": "SignIn",
    
}

// const request = {
//     "TransactionType": "NFTokenMint",
    
// }


const subscription = await Sdk.payload.createAndSubscribe(request,event => {
    console.log("event response code",event.data);
    

    // it is used to hold the node untill the request get signed
    if (Object.keys(event).indexOf('signed') > -1) {
       return event;
    }
})

console.log(subscription);
}
main()