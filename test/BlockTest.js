const DeviceFactory = artifacts.require('DeviceFactory');
const Proofs = artifacts.require('Proofs');
const assert = require('assert');
const web3 = require('web3');

const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Basic test for block_number", function (accounts) {
    var device_factory, device, proof_factory, proofs, proof_types;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        device_factory = await DeviceFactory.deployed();
        proof_types = {
            WIPE: 0,
            FUNCTION: 1,
            REUSE: 2,
            RECYCLE: 3,
            DISPOSAL: 4
        }

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
        let hash = await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0] });

        let = await device.getFunctionProof(hash);
    });

});

function extractProofAddress(receipt) {
    return receipt.logs[0].args.proof
}