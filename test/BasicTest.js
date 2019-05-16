const MyERC721 = artifacts.require("MyERC721");
const CRUD = artifacts.require('CRUD');
const DAO = artifacts.require('DAO');
const CrudFactory = artifacts.require('CRUDFactory');
const Producers = artifacts.require('ProducerRole');
const Consumers = artifacts.require('ConsumerRole');
const Recyclers = artifacts.require('RecyclerRole');


const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    })
const network = argv.network;
const MAC_ADDRESS = '37-ff-4e-16-bc-c8';

contract("Basic test with three roles and one device", async function (accounts) {

    it("mints a new device and performs different operations from the different accounts", async function () {

        ProducerAccount = accounts[0];
        ConsumerAccount = accounts[1];
        RecyclerAccount = accounts[2];

        token = await MyERC721.deployed();
        dao = await DAO.deployed();
        cfact = await CrudFactory.deployed();
        addr = await cfact.getDevices.call();
        crud = await CRUD.at(addr);
        
        console.log('Adding accounts to its corresponding role');
        
        await dao.requestRecyclerMint(RecyclerAccount);
        await dao.requestProducerMint(ProducerAccount);
        await dao.requestConsumerMint(ConsumerAccount);

        await dao.isConsumer(ConsumerAccount).then(i => {
            assert.isTrue(i, 'Consumer account was not correctly added');
        });
        await dao.isProducer(ProducerAccount).then(i => {
            assert.isTrue(i, 'Producer account was not correctly added');
        });
        await dao.isRecycler(RecyclerAccount).then(i => {
            assert.isTrue(i, 'Recycler account was not correctly added');
        });

        console.log('Accounts added succesfully');


        // Minting the device

        token_id = await token.mint_device(MAC_ADDRESS, {
            from: ProducerAccount
        });

        console.log(token_id);  

        await crud.exists_mac(MAC_ADDRESS).then(i => {
            assert.isTrue(i, "The device was not minted correctly");
        });

        // await token.rent(token_id, ConsumerAccount, {
        //     from: ProducerAccount
        // });

        // await token.pass(token_id, RecyclerAccount, {
        //     from: ConsumerAccount
        // });

        // await token.recycle({
        //     from: ConsumerAccount
        // });

        console.log('Succesfully minted the device');
    });
});
