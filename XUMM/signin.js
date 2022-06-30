const {XummSdk} = require('xumm-sdk')
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')




const main = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)



const request = {
     "txjson": {
        "TransactionType": "SignIn"
   }
}


const subscription = await Sdk.payload.createAndSubscribe(request,event => {
    console.log("event response code",event.data);
    

    // it is used to hold the node untill the request get signed
    if (Object.keys(event.data).indexOf('signed') > -1) {
       return event.data;
    }
})

console.log("Subscription =======>\n",subscription.created);

const resolved = await subscription.resolved;
// console.log("Resolved data +++++++++++++++++++++\n",resolved)

const result = await Sdk.payload.get(resolved.payload_uuidv4)
console.log('User token:', result.application.issued_user_token)

}
main()