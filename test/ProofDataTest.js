const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const ProofsHandler = artifacts.require('ProofsHandler');
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

        assert.equal(hashes.length, 2)

        let first_proof = await device.getFunctionProof(hashes[0]);
        let second_proof = await device.getFunctionProof(hashes[1]);

        assert.equal(web3.utils.toDecimal(first_proof.score), score);
        assert.equal(web3.utils.toDecimal(first_proof.diskUsage), diskUsage);
        assert.equal(first_proof.algorithmVersion, algorithmVersion);

        assert.equal(web3.utils.toDecimal(second_proof.score), score);
        assert.equal(web3.utils.toDecimal(second_proof.diskUsage), diskUsage);
        assert.equal(second_proof.algorithmVersion, algorithmVersion);
    });

    it("Generates proof of Transfer", async function () {
        let supplier = accounts[1];
        let receiver = accounts[2];
        let deposit = 20;
        let isWaste = false;
        let proofType = "transfer";

        let device = await DepositDevice.at(deviceAddress);

        await device.generateTransferProof(supplier, receiver,
            deposit, isWaste, { from: accounts[0], gas: 6721975 });
        await device.generateTransferProof(supplier, receiver,
            deposit, isWaste, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        assert.equal(hashes.length, 2)

        first_proof = await device.getTransferProof(hashes[0]);
        second_proof = await device.getTransferProof(hashes[1]);

        assert.equal(web3.utils.toChecksumAddress(first_proof.supplier), supplier);
        assert.equal(web3.utils.toChecksumAddress(first_proof.receiver),
            receiver);
        assert.equal(web3.utils.toDecimal(first_proof.deposit), deposit);
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

        assert.equal(hashes.length, 2)

        first_proof = await device.getDataWipeProof(hashes[0]);
        second_proof = await device.getDataWipeProof(hashes[1]);

        assert.equal(first_proof.erasureType, erasureType);
        assert.equal(first_proof.date, date);
        assert.equal(first_proof.erasureResult, erasureResult);

        assert.equal(second_proof.erasureType, erasureType);
        assert.equal(second_proof.date, date);
        assert.equal(second_proof.erasureResult, erasureResult);
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

        assert.equal(hashes.length, 2)

        first_proof = await device.getRecycleProof(hashes[0]);
        second_proof = await device.getRecycleProof(hashes[1]);

        assert.equal(first_proof.collectionPoint, collectionPoint);
        assert.equal(first_proof.date, date);
        assert.equal(first_proof.contact, contact);
        assert.equal(first_proof.ticket, ticket);
        assert.equal(first_proof.gpsLocation, gpsLocation);

        assert.equal(second_proof.collectionPoint, collectionPoint);
        assert.equal(second_proof.date, date);
        assert.equal(second_proof.contact, contact);
        assert.equal(second_proof.ticket, ticket);
        assert.equal(second_proof.gpsLocation, gpsLocation);
    });

    it("Generates proof of Reuse", async function () {
        let price = 10;
        let receiverSegment = "segment1";
        let idReceipt = "1876323hh823";
        let supplier = accounts[1];
        let receiver = accounts[2];

        let proofType = "reuse"
        let device = await DepositDevice.at(deviceAddress);

        await device.generateReuseProof(receiverSegment, idReceipt, supplier,
            receiver, price, { from: accounts[0], gas: 6721975 });
        await device.generateReuseProof(receiverSegment, idReceipt, supplier,
            receiver, price, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        assert.equal(hashes.length, 2)

        first_proof = await device.getReuseProof(hashes[0]);
        second_proof = await device.getReuseProof(hashes[1]);

        assert.equal(web3.utils.toDecimal(first_proof.price), price);
        assert.equal(first_proof.receiverSegment, receiverSegment);
        assert.equal(first_proof.idReceipt, idReceipt);
        assert.equal(web3.utils.toChecksumAddress(first_proof.supplier),
            web3.utils.toChecksumAddress(supplier));
        assert.equal(web3.utils.toChecksumAddress(first_proof.receiver),
            web3.utils.toChecksumAddress(receiver));

        assert.equal(web3.utils.toDecimal(second_proof.price), price);
        assert.equal(second_proof.receiverSegment, receiverSegment);
        assert.equal(second_proof.idReceipt, idReceipt);
        assert.equal(web3.utils.toChecksumAddress(second_proof.supplier),
            web3.utils.toChecksumAddress(supplier));
        assert.equal(web3.utils.toChecksumAddress(second_proof.receiver),
            web3.utils.toChecksumAddress(receiver));
    });
});

function extractEvents(receipt) {
    return receipt.logs[0].args
}