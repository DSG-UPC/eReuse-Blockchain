const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const ProofsHandler = artifacts.require('ProofsHandler');
const assert = require('assert');
const web3 = require('../ganache-web3');

const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Test for generic proof data", function (accounts) {
    var device_factory;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        device_factory = await DeviceFactory.deployed();
        handler = await ProofsHandler.deployed();
    });

    it("Generates two proofs and checks the value of deviceUsage", async function () {
        let id1 = 0;
        let score = 8;
        let diskUsage = 20;
        let algorithm = "v3"
        let proofAuthor = accounts[3]
        let diskSN = '5QE0RCHD'

        await device_factory.createDevice(id1, 0, accounts[0]);

        deviceAddress = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices.pop();
            });
        let device = await DepositDevice.at(deviceAddress);

        let usage = await device.getDeviceUsage.call();
        assert.equal(web3.utils.toDecimal(usage), 0);

        await device.generateFunctionProof(score, diskUsage, algorithm,
            proofAuthor, diskSN, { from: accounts[0], gas: 6721975 });

        usage = await device.getDeviceUsage.call();
        assert.equal(web3.utils.toDecimal(usage), 20);

        await device.generateFunctionProof(score, diskUsage, algorithm,
            proofAuthor, diskSN, { from: accounts[0], gas: 6721975 });

        usage = await device.getDeviceUsage.call();
        console.log(`Current usage: ${web3.utils.toDecimal(usage)}`);
        assert.equal(web3.utils.toDecimal(usage), 40);
    });
});