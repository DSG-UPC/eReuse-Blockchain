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
        let algorithmVersion = "v3";
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

        await device.generateFunctionProofMetrics(score, diskUsage, algorithmVersion,
            proofAuthor, diskSN, deviceSN, deviceModel, deviceManufacturer,
            { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);
        let hash = hashes.pop();
        let proof = await device.getFunctionProof(hash);
        let metrics = await device.getMetrics(hash, proofType);

        assert.equal(proof.score, score);
        assert.equal(proof.diskUsage, diskUsage);
        assert.equal(proof.algorithmVersion, algorithmVersion);
        assert.equal(proof.proofAuthor, proofAuthor);

        assert.equal(metrics.diskSN, diskSN);
        assert.equal(metrics.deviceSN, deviceSN);
        assert.equal(metrics.deviceModel, deviceModel);
        assert.equal(metrics.deviceManufacturer, deviceManufacturer);

    });

    it("Generates a DataWipeProof with metrics values and checks them", async function () {
        let id1 = 0;
        let erasureType = "Full Erasure";
        let erasureResult = true;
        let proofAuthor = accounts[3];
        let proofType = "ProofDataWipe"

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

        await device.generateDataWipeProofMetrics(erasureType, erasureResult,
            proofAuthor, diskSN, deviceSN, deviceModel, deviceManufacturer,
            { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);
        let hash = hashes.pop();
        let proof = await device.getDataWipeProof(hash);
        let metrics = await device.getMetrics(hash, proofType);

        assert.equal(proof.erasureType, erasureType);
        assert.equal(proof.erasureResult, erasureResult);
        assert.equal(proof.proofAuthor, proofAuthor);

        assert.equal(metrics.diskSN, diskSN);
        assert.equal(metrics.deviceSN, deviceSN);
        assert.equal(metrics.deviceModel, deviceModel);
        assert.equal(metrics.deviceManufacturer, deviceManufacturer);

    });
});