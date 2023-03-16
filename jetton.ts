import { Address, TonClient, fromNano } from 'ton';

const wallet = Address.parse('EQCJO7qT3C3eiPTP9eeC7CXERZ0og4SUn8ztyLp_Sg252IGq');
const jetton = Address.parse('EQB5PkmgRaFh6UFrM8gb5YTEpCtJXa--TFHcJ_n8bmVnuZVv');

export const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
});

// const data = await client.callGetMethod(jetton, 'get_wallet_data')
// console.log(data)

(async () => {
    let { stack } = await client.callGetMethod(
        jetton, 
        'get_wallet_data'
    );
    let balance = stack.readBigNumber();
    let owner = stack.readAddress();
    let jet = stack.readAddress();
    let jetton_wallet_code = stack.readCell();
    
    console.log('balance', fromNano(balance));
    console.log('owner', owner);
    console.log('jet', jet);
    // console.log('jetton_wallet_code', jetton_wallet_code);
})().catch(e => console.error(e));