const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const assert = require('assert');
const web3 = require('web3');

const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Basic test for block_number", function (accounts) {
    var device_factory;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        device_factory = await DeviceFactory.deployed();

        await device_factory.createDevice("device", 0, accounts[0]);

        deviceAddress = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices[0];
            });
    });

    it("Generates proof of function", async function () {
        let score = 10;
        let diskUsage = 20;
        let algorithmVersion = 'v3.1';

        let device = await DepositDevice.at(deviceAddress);

        await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0], gas: 6721975 });
        await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0], gas: 6721975 });

        let proofs = await device.getProofs("function");

        let first_proof = await device.getProof(proofs[0], "function");
        let second_proof = await device.getProof(proofs[1], "function");

        assert.notEqual(first_proof.block_number, second_proof.block_number);
    });

});

function extractProofAddress(receipt) {
    return receipt.logs[0].args.proof
}