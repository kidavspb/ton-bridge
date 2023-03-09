import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, fromNano, Address, JettonWallet } from "ton";

async function main() {
  try {

    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    const address = Address.parse(process.argv.slice(2)[0])
    const balance = await client.getBalance(address);
    console.log("balance:", fromNano(balance));
    
  } catch (e) {
    console.log("Something went wrong");
  }
}

main();
