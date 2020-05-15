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

    it("Generates a FunctionProof with metrics values and checks them", async function () {
        let id1 = 0;
        let score = 8;
        let diskUsage = 20;
        let algorithm = "v3";
        let proofAuthor = accounts[3];
        let proofType = "ProofFunction"

        let diskSN = '5uyg3ry32';
        let deviceSN = '7626gbdw6';
        let deviceModel = 'x540l';
        let deviceManufacturer = 'asus';

        await device_factory.createDevice(id1, 0, accounts[0]);

        deviceAddress = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices.pop();
            });
        let device = await DepositDevice.at(deviceAddress);

        await device.generateFunctionProofMetrics(score, diskUsage, algorithm,
            proofAuthor, diskSN, deviceSN, deviceModel, deviceManufacturer,
            { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);
        console.log(hashes);
        let proof = await device.getFunctionProof(hashes.pop());

        let metrics = await device.getMetrics(proof, proofType);
        console.log(metrics);
    });
});