const xrpl = require("xrpl");


async function main(){

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    console.log("XRPL CLIENT CONNECTED \n\n")

    
    client.disconnect()
}

main()