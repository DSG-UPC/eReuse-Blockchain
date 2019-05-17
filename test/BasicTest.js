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

        token_id = await token.mint_device.call(MAC_ADDRESS, {
            from: ProducerAccount
        });

        await token.mint_device(MAC_ADDRESS, {
            from: ProducerAccount
        });

        await token.getDevices().then(async (devices) => {
            return await CRUD.at(devices);
        }).then(i => {
            crud = i;
        });

        await crud.exists(token_id.toNumber()).then(i => {
            assert.isTrue(i, "The device was not minted correctly");
        });



        // Token ownership transfer


        /**
         * The current owner must be the producer
         */
        result = await crud.getByUID.call(token_id.toNumber());
        assert.equal(ProducerAccount, result.owner);


        await token.rent(token_id.toNumber(), ConsumerAccount, {
            from: ProducerAccount
        });

        /**
         * The current owner must be the consumer
         */
        result = await crud.getByUID.call(token_id.toNumber());
        assert.equal(ConsumerAccount, result.owner);

        await token.pass(token_id.toNumber(), RecyclerAccount, {
            from: ConsumerAccount
        });

        /**
         * The current owner must be the recycler
         */
        result = await crud.getByUID.call(token_id.toNumber());
        assert.equal(RecyclerAccount, result.owner);

        await token.recycle(token_id.toNumber(), {
            from: RecyclerAccount
        });

        /**
         * The token shouldn't exist at this point
         */
        await crud.exists(token_id.toNumber()).then(i => {
            assert.isFalse(i, "The device should not exist at this point");
        });

        console.log('Succesfully minted the device');
    });
});
