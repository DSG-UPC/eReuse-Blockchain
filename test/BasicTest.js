/*jshint esversion: 8 */

const MyERC721 = artifacts.require("MyERC721");
const ERC20 = artifacts.require('EIP20');
const CRUD = artifacts.require('CRUD');
const RoleManager = artifacts.require('RoleManager');
const DAO = artifacts.require('DAO');
const CrudFactory = artifacts.require('CRUDFactory');


const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;
const MAC_ADDRESS = '37-ff-4e-16-bc-c8';

contract("Basic test with three roles and one device", async function (accounts) {

    it("mints a new device and performs different operations from the different accounts", async function () {

        price = 150;

        ProducerAccount = accounts[0];
        ConsumerAccount = accounts[1];
        RecyclerAccount = accounts[2];
        DeviceAccount = accounts[3];

        token = await MyERC721.deployed();
        erc20 = await ERC20.deployed();
        dao = await DAO.deployed();
        cfact = await CrudFactory.deployed();

        console.log('Adding accounts to its corresponding role');

        await token.requestRecyclerMint(RecyclerAccount);
        await token.requestProducerMint(ProducerAccount);
        await token.requestConsumerMint(ConsumerAccount);

        await token.getManager().then(manager_addr => {
            return manager_addr;
        }).then(async manager_addr => {
            manager = await RoleManager.at(manager_addr);

            await manager.isConsumer(ConsumerAccount).then(i => {
                assert.isTrue(i, 'Consumer account was not correctly added');
            });

            await manager.isProducer(ProducerAccount).then(i => {
                assert.isTrue(i, 'Producer account was not correctly added');
            });

            await manager.isRecycler(RecyclerAccount).then(i => {
                assert.isTrue(i, 'Recycler account was not correctly added');
            });
        });

        console.log('Accounts added succesfully');


        // Minting the device

        await token.getDevices().then(async (devices) => {
            return await CRUD.at(devices);
        }).then(i => {
            crud = i;
        });

        await crud.getCount.call().then(async count => {
            token_id = await count.toNumber() + 1;
        });
        
        await erc20.approve(token.address, price, {
            from: ProducerAccount
        });

        // await erc20.transfer(token.address, price, {
        //     from: ProducerAccount
        // });
        
        // await erc20.balanceOf(ProducerAccount).then(i => {
        //     console.log(`Balance of producer: ${i.toNumber()}`);
        // });

        // await erc20.balanceOf(token.address).then(i => {
        //     console.log(`Balance erc721: ${i.toNumber()}`);
        // });

        // await erc20.allowance(ProducerAccount, token.address).then(i => {
        //     console.log(`Allowance: ${i.toNumber()}`);
        // });

        await token.mint_device(MAC_ADDRESS, DeviceAccount, price, {
            from: ProducerAccount
        });

        await crud.exists(token_id).then(i => {
            assert.isTrue(i, "The device was not minted correctly");
        });

        console.log('Succesfully minted the device');


        // Token ownership transfer


        /**
         * The current owner must be the producer
         */
        result = await crud.getByUID.call(token_id);
        assert.equal(ProducerAccount, result.owner);

        await token.rent(token_id, ConsumerAccount, 1, {
            from: ProducerAccount
        });

        /**
         * The current owner must be the first consumer
         */
        result = await crud.getByUID.call(token_id);
        assert.equal(ConsumerAccount, result.owner);

        await token.pass(token_id, ConsumerAccount2, {
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