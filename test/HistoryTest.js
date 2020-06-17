const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const ProofsHandler = artifacts.require('ProofsHandler');
const DeliveryNote = artifacts.require('DeliveryNote');
const DAO = artifacts.require('DAO');
const ERC20 = artifacts.require('EIP20');
const assert = require('assert');
const web3 = require('../ganache-web3');

const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });

contract("Test to find older events", function (accounts) {
    var device_factory;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        handler = await ProofsHandler.deployed();
        erc20 = await ERC20.deployed();
        dao = await DAO.deployed();
    });

    it('Creates two devices and checks for events', async function () {
        let sender = accounts[0];
        let id1 = 0;
        let id2 = 1;

        let device_factory = await DeviceFactory.deployed();
        await device_factory.createDevice(id1, 0, sender);
        await device_factory.createDevice(id2, 0, sender);

        let events = await device_factory.getPastEvents('LifeCycleAction',
            { fromBlock: 0, toBlock: 'latest' })

        assert(events.length == 2);
    });

    it('Generates reuse proof for some device and checks for events', async function () {
        const sender = accounts[1];
        const id1 = 0;

        const price = 10;
        const receiverSegment = "segment1";
        const idReceipt = "1876323hh823";

        const device_factory = await DeviceFactory.deployed();
        await device_factory.createDevice(id1, 0, sender);

        let d1 = await device_factory.getDeployedDevices({ from: sender });
        let device = await DepositDevice.at(d1[0]);

        await device.generateReuseProof(receiverSegment, idReceipt, price,
            { from: accounts[0], gas: 6721975 });

        let events = await device.getPastEvents('LifeCycleAction',
            { fromBlock: 0, toBlock: 'latest' })

        assert(events.length == 1);
    });

});