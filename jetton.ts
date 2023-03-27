import { Address, TonClient, fromNano, TupleBuilder } from 'ton';
import { API_TOKEN } from './secret';

const jettonMasterContract = Address.parse('EQDJcHy2w-s3I3KXFtOThZa4W6bmzUBuQ0mjjiQVfd-y546W');

export const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: API_TOKEN,
});

async function main() {
    try {
        const owner_address = new TupleBuilder()
        owner_address.writeAddress(Address.parse(process.argv.slice(2)[0]))

        var { stack } = await client.callGetMethod(
            jettonMasterContract, 
            'get_wallet_address',
            owner_address.build()
        );
        let jetton_wallet_address = stack.readAddress();
        console.log('jetton_wallet_address', jetton_wallet_address);

        var { stack } = await client.callGetMethod(
            jetton_wallet_address, 
            'get_wallet_data'
        );
        let balance = stack.readBigNumber();
        let owner = stack.readAddress();
        let jetton = stack.readAddress();
        let jetton_wallet_code = stack.readCell();
        
        console.log('balance', fromNano(balance));
        // console.log('owner', owner);
        // console.log('jetton', jetton);
        // console.log('jetton_wallet_code', jetton_wallet_code);
    } catch (e) {
        console.log("Something went wrong");
    }
}

main()