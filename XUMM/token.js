/**
 * XRP client based 
 */
const xrpl = require('xrpl')

async function main() {

    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233")
    await client.connect()

    // Get credentials from the Testnet Faucet 
    const hot_wallet = await xrpl.Wallet.fromSeed('spoB7AHfzTqbg1ihY4aGJiGSFwsR4')
    const cold_wallet = await xrpl.Wallet.fromSeed('sncVUL2SeJyn1TNyHmDqeNQ3C8L9p')

    console.log("Hot_wallet", hot_wallet)
    console.log("Cold wallet", cold_wallet)

    // Configure issuer (cold address) "issuer" settings
    const cold_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": cold_wallet.classicAddress,          // address instead of classicAddress
        "TransferRate": 0,
        "TickSize": 5,
        "Domain": xrpl.convertStringToHex("example.com"),
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
        // Using tf flags, we can enable more flags in one transaction
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP | xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const cst_prepared = await client.autofill(cold_settings_tx)
    const cst_signed = cold_wallet.sign(cst_prepared)
    console.log("Sending cold address AccountSet transaction...")
    const cst_result = await client.submitAndWait(cst_signed.tx_blob)
    if (cst_result.result.meta.TransactionResult == "tesSUCCESS"){
        console.log(`Transaction succeeded : https://devnet.xrpl.org/transactions/${cst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${cst_result}`
    }


    // Configure hot address settings

    const hot_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": hot_wallet.classicAddress,
        "Domain": xrpl.convertStringToHex("example.com"),
        // Enable require Auth so we can't use trust lines that users
        // make to the hot address, even by accident:
        // "SetFlags": xrpl.AccountSetAsfFlags.asfRequireAuth,
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP | xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const hst_prepared = await client.autofill(hot_settings_tx)
    const hst_signed = hot_wallet.sign(hst_prepared)
    console.log("Sending hot address AccountSet transaction....")
    const hst_result = await client.submitAndWait(hst_signed.tx_blob)
    if (hst_result.result.meta.TransactionResult == "tesSUCCESS"){
        console.log(`Transaction succeeded : https://devnet.xrpl.org/transactions/${hst_signed.hash}`)   
    } else {
        throw `Error sending transaction: ${hst_result.meta.TransactionResult}`
    }



    // Create trustline from hot to cold address
    const currency_code = "TRI"
    const trust_set_tx = {
        "TransactionType": "TrustSet", 
        "Account": hot_wallet.classicAddress,
        "LimitAmount": {
            "currency": currency_code,
            "issuer": cold_wallet.classicAddress,
            "value": "10000000000"
        }
    }

    const ts_prepared = await client.autofill(trust_set_tx)
    const ts_signed = hot_wallet.sign(ts_prepared)
    console.log("Creating trust line from hot address to issuer...")
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://devnet.xrpl.org/transactions/${ts_signed.hash}`)
    } else {
      throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
    }


    // Send token
    const issue_quantity = "3000"
    const send_token_tx = {
        "TransactionType": "Payment",
        "Account": cold_wallet.classicAddress,
        "Amount": {
            "currency": currency_code,
            "value": issue_quantity,
            "issuer": cold_wallet.classicAddress
        },
        "Destination": hot_wallet.classicAddress,
        "DestinationTag": 1         // Needed since we enabled Require Destination Tags
                                    // on the hot account earlier.
    }

    const pay_prepared = await client.autofill(send_token_tx)
    const pay_signed = cold_wallet.sign(pay_prepared)
    console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_wallet.classicAddress}...`)
    const pay_result = await client.submitAndWait(pay_signed.tx_blob)
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://devnet.xrpl.org/transactions/${pay_signed.hash}`)
      } else {
        throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
      }


    //   check balances 
    console.log("Getting hot address balances...")
    const hot_balances = await client.request({
        command: "account_lines",
        account: hot_wallet.classicAddress,
        ledger_index: "validated"
    })

    console.log(hot_balances.result)

    console.log("Getting cold address balances...")
    const cold_balances = await client.request({
        command: "gateway_balances",
        account: cold_wallet.classicAddress,
        ledger_index: "validated",
        hotwallet: [hot_wallet.classicAddress]
    })
    console.log(JSON.stringify(cold_balances.result, null, 2))

    client.disconnect()
}
main()




