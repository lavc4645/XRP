const {XummSdk} = require('xumm-sdk')
const Sdk = new XummSdk('5c9e4bd1-0f7a-4a7a-97c0-e2d7592a4e7d', 'd51f7b5f-d9da-4ffe-a06d-4a9e073171c0')


const main = async () => {
    const appInfo = await Sdk.ping()
    console.log(appInfo.application.name)


    const request = {
        "TransactionType": "Payment",
        "Destination": "rHqjcvgDtH8qCR9uQcBxeiJmdpjvgsVKAx",
        "Amount": "100",
        "Memos": [
            {
                "Memo": {
                    "MemoData": "F09F988E20596F7520726F636C22"
                }
            }
        ]
    }


    

    const payload = await Sdk.payload.create(request, true)
    console.log(payload)
}

main()