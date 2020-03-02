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

contract("Test for block_number", function (accounts) {
    var device_factory;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        device_factory = await DeviceFactory.deployed();
        handler = await ProofsHandler.deployed();

        await device_factory.createDevice("device", 0, accounts[0]);

        deviceAddress = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices[0];
            });
    });

    it("Generates proof of Function", async function () {
        let score = 10;
        let diskUsage = 20;
        let algorithmVersion = 'v3.1';
        let proofType = "function";

        let device = await DepositDevice.at(deviceAddress);

        await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0], gas: 6721975 });
        await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let first_proof = await device.getProof(hashes[0], proofType);
        let second_proof = await device.getProof(hashes[1], proofType);

        let handler_first = await handler.getFunctionProof(hashes[0]);
        let handler_second = await handler.getFunctionProof(hashes[1]);

        assert_blockchain(first_proof, second_proof,
            handler_first, handler_second);

        let first_proof_block = await web3.eth.getBlock(web3.utils.toDecimal(first_proof.block_number));
        console.log(first_proof_block);
    });

    it("Generates proof of Disposal", async function () {
        let origin = accounts[1];
        let destination = accounts[2];
        let deposit = 20;
        let isResidual = false;

        let proofType = "disposal";
        let device = await DepositDevice.at(deviceAddress);

        await device.generateDisposalProof(origin, destination,
            deposit, isResidual, { from: accounts[0], gas: 6721975 });
        await device.generateDisposalProof(origin, destination,
            deposit, isResidual, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let first_proof = await device.getProof(hashes[0], proofType);
        let second_proof = await device.getProof(hashes[1], proofType);

        let handler_first = await handler.getDisposalProof(hashes[0]);
        let handler_second = await handler.getDisposalProof(hashes[1]);

        assert_blockchain(first_proof, second_proof,
            handler_first, handler_second);
    });

    it("Generates proof of Data Wipe", async function () {
        let erasureType = "complete_erasure";
        let date = new Date().toDateString();
        let erasureResult = true;
        let proofType = "wipe";
        let device = await DepositDevice.at(deviceAddress);

        await device.generateDataWipeProof(erasureType, date, erasureResult,
            { from: accounts[0], gas: 6721975 });
        await device.generateDataWipeProof(erasureType, date, erasureResult,
            { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let first_proof = await device.getProof(hashes[0], proofType);
        let second_proof = await device.getProof(hashes[1], proofType);

        let handler_first = await handler.getDataWipeProof(hashes[0]);
        let handler_second = await handler.getDataWipeProof(hashes[1]);

        assert_blockchain(first_proof, second_proof,
            handler_first, handler_second);
    });

    it("Generates proof of Recycle", async function () {
        let collectionPoint = "Recicla2";
        let date = new Date().toDateString();
        let contact = "John";
        let ticket = "2187463785273jhcd";
        let gpsLocation = "41.3851, 2.1734";
        let proofType = "recycle"
        let device = await DepositDevice.at(deviceAddress);

        await device.generateRecycleProof(collectionPoint, date, contact,
            ticket, gpsLocation, { from: accounts[0], gas: 6721975 });
        await device.generateRecycleProof(collectionPoint, date, contact,
            ticket, gpsLocation, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let first_proof = await device.getProof(hashes[0], proofType);
        let second_proof = await device.getProof(hashes[1], proofType);

        let handler_first = await handler.getRecycleProof(hashes[0]);
        let handler_second = await handler.getRecycleProof(hashes[1]);
        
        assert_blockchain(first_proof, second_proof,
            handler_first, handler_second);
    });

    it("Generates proof of Reuse", async function () {
        let price = 10;
        let proofType = "reuse"
        let device = await DepositDevice.at(deviceAddress);

        await device.generateReuseProof(price,
            { from: accounts[0], gas: 6721975 });
        await device.generateReuseProof(price,
            { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let first_proof = await device.getProof(hashes[0], proofType);
        let second_proof = await device.getProof(hashes[1], proofType);

        let handler_first = await handler.getReuseProof(hashes[0]);
        let handler_second = await handler.getReuseProof(hashes[1]);

        assert_blockchain(first_proof, second_proof,
            handler_first, handler_second);
    });
});

function extractEvents(receipt) {
    return receipt.logs[0].args
}

function assert_blockchain(first_proof, second_proof, handler_first, handler_second) {
    assert.notEqual(web3.utils.toDecimal(first_proof.block_number),
        web3.utils.toDecimal(second_proof.block_number));

    assert.equal(web3.utils.toDecimal(first_proof.block_number),
        web3.utils.toDecimal(handler_first.block_number));
    assert.equal(first_proof.device_id, handler_first.device_id);
    assert.equal(first_proof.owner, handler_first.owner);

    assert.equal(web3.utils.toDecimal(second_proof.block_number),
        web3.utils.toDecimal(handler_second.block_number));
    assert.equal(second_proof.device_id, handler_second.device_id);
    assert.equal(second_proof.owner, handler_second.owner);
}