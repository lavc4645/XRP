const {XummSdk} = require('xumm-sdk')
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')


const main = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)

    /**
     * Please change the desination account to the account
     * you own or you'll be testing sending the small amount of XRP to XRPL team
     */

    const request = {
        "TransactionType": "Payment",
        "Destination": "rHqjcvgDtH8qCR9uQcBxeiJmdpjvgsVKAx",
        "Amount": "100",
        "Memos": [
            {
                "Memo": {
                    "MemoData": "F09F988E20596F7520726F636B21"
                }
            }
        ]
    }


    

    const subscription = await Sdk.payload.createAndSubscribe(request, event => {
        // console.log('New payload event:', event.data)
    
        //  The event data contains a property 'signed' (true or false), return :)
        
        if (event.data.signed === false) {
            // console.log(' The sign request was rejected :(')
            return false
        } 
        
        
        if (event.data.signed === true) {
            // console.log('Woohoo! The sign request was signed :)',event.data)
           return event.data
        }
         }).then(xtz => {

            //  console.log(xtz)
         })


        console.log("Subscription\n",subscription.created)


        /**
         * Now let's wait until the subscription resolved (by returning something)
         * in the callback function
         */


        const resolveData = await subscription.resolved


        if (resolveData.signed === false) {
            console.log(' The sign request was rejected :(')
        }

        if (resolveData.signed === true) {
            console.log('Woohoo! The sign request was signed')


            /**
             * Let's fetch the full payload end result, and get the issued
             * user token, we can use to send our next payload per push notification
             */


        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        console.log('User token:', result.application.issued_user_token)
        }



}

main()