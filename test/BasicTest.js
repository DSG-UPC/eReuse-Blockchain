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

        price = 150;

        ProducerAccount = accounts[0];
        ConsumerAccount = accounts[1];
        ConsumerAccount2 = accounts[2];
        ConsumerAccount3 = accounts[3];
        RecyclerAccount = accounts[4];

        token = await MyERC721.deployed();
        dao = await DAO.deployed();
        cfact = await CrudFactory.deployed();

        console.log('Adding accounts to its corresponding role');

        await dao.requestRecyclerMint(RecyclerAccount);
        await dao.requestProducerMint(ProducerAccount);
        await dao.requestConsumerMint(ConsumerAccount);
        await dao.requestConsumerMint(ConsumerAccount2);
        await dao.requestConsumerMint(ConsumerAccount3);

        await dao.isConsumer(ConsumerAccount).then(i => {
            assert.isTrue(i, 'Consumer account was not correctly added');
        });
        await dao.isConsumer(ConsumerAccount2).then(i => {
            assert.isTrue(i, 'Consumer account was not correctly added');
        });
        await dao.isConsumer(ConsumerAccount3).then(i => {
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

        token_id = await token.mint_device.call(MAC_ADDRESS, price, {
            from: ProducerAccount
        });

        await token.mint_device(MAC_ADDRESS, price, {
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

        console.log('Succesfully minted the device');


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
         * The current owner must be the first consumer
         */
        result = await crud.getByUID.call(token_id.toNumber());
        assert.equal(ConsumerAccount, result.owner);

        await token.pass(token_id.toNumber(), ConsumerAccount2, {
            from: ConsumerAccount
        });


        /**
         * The current owner must be the second consumer
         */
        result = await crud.getByUID.call(token_id.toNumber());
        assert.equal(ConsumerAccount2, result.owner);

        await token.pass(token_id.toNumber(), ConsumerAccount3, {
            from: ConsumerAccount2
        });


        /**
         * The current owner must be the third consumer
         */
        result = await crud.getByUID.call(token_id.toNumber());
        assert.equal(ConsumerAccount3, result.owner);

        await token.pass(token_id.toNumber(), RecyclerAccount, {
            from: ConsumerAccount3
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

        /**
         * Checking the historical owners of the device
         */
        owners = await crud.getHistoricalOwners.call(token_id.toNumber());
        assert.equal(owners.length, 5);
    });
});