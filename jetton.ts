import { Address, TonClient, fromNano, Dictionary } from 'ton';
import { API_TOKEN } from './secret';

const wallet = Address.parse('EQCJO7qT3C3eiPTP9eeC7CXERZ0og4SUn8ztyLp_Sg252IGq');
const JettonWalletSmartContractAdress = Address.parse('EQB5PkmgRaFh6UFrM8gb5YTEpCtJXa--TFHcJ_n8bmVnuZVv');

export const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: API_TOKEN,
});

async function main() {
    var { stack } = await client.callGetMethod(
        JettonWalletSmartContractAdress, 
        'get_wallet_data'
    );
    let balance = stack.readBigNumber();
    let owner = stack.readAddress();
    let jetton = stack.readAddress();
    let jetton_wallet_code1 = stack.readCell();
    
    console.log('balance', fromNano(balance));
    console.log('owner', owner);
    console.log('jetton', jetton);
    // console.log('jetton_wallet_code', jetton_wallet_code1);

    var { stack } = await client.callGetMethod(
        jetton, 
        'get_jetton_data'
    );
    let total_supply = stack.readBigNumber();
    let mintable = stack.readBigNumber();
    let admin_address = stack.readAddress();
    var jetton_content = stack.readCell();
    let jetton_wallet_code2 = stack.readCell();
    
    console.log('total_supply', fromNano(total_supply));
    // console.log('mintable', mintable);
    console.log('admin_address', admin_address);
    console.log('jetton_content', jetton_content.toBoc().toString());
    // console.log('jetton_wallet_code', jetton_wallet_code2);
}


main()
