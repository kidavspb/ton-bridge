import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, Address, WalletContractV4, internal, fromNano } from "ton";
import { MNEMONIC } from "./secret2";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const key = await mnemonicToWalletKey(MNEMONIC.split(" "));
  const walletSender = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // make sure wallet is deployed
  if (!await client.isContractDeployed(walletSender.address)) {
    return console.log("wallet is not deployed");
  }

  const balanceSender = await client.getBalance(walletSender.address);
  const walletRecipient = Address.parse(process.argv.slice(2)[0]);
  const balanceRecipient = await client.getBalance(walletRecipient);

  console.log("**************************************");
  console.log("BalanceSender before transaction: ", fromNano(balanceSender));
  console.log("BalanceRecipient before transaction: ", fromNano(balanceRecipient));
  console.log("**************************************");
  

  // send 0.001 TON
  const walletContract = client.open(walletSender);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: walletRecipient,
        value: "0.001", // 0.001 TON
        body: "Hello from Max!", // optional comment
        bounce: false,
      })
    ]
  });

  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");

  //Берем новые значения
  const balanceSender2 = await client.getBalance(walletSender.address);
  const walletRecipient2 = Address.parse(process.argv.slice(2)[0]);
  const balanceRecipient2 = await client.getBalance(walletRecipient2);

  console.log("**************************************");
  console.log("BalanceSender after transaction: ", fromNano(balanceSender2));
  console.log("BalanceRecipient after transaction: ", fromNano(balanceRecipient2));
  console.log("**************************************");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}