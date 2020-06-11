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

        await device_factory.createDevice(0, 0, accounts[0]);

        deviceAddress = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices[0];
            });
    });

    it("Generates proof of Function", async function () {
        let score = 10;
        let diskUsage = 20;
        let algorithmVersion = 'v3.1';
        let proofAuthor = accounts[1]
        let proofType = "ProofFunction";

        let device = await DepositDevice.at(deviceAddress);

        await device.generateFunctionProof(score, diskUsage, algorithmVersion,
            proofAuthor, { from: accounts[0], gas: 6721975 });
        await device.generateFunctionProof(score, diskUsage, algorithmVersion,
            proofAuthor, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let second_proof = await device.getFunctionProof(hashes.pop());
        let first_proof = await device.getFunctionProof(hashes.pop());

        let _score = await first_proof.score;
        let _diskUsage = await first_proof.diskUsage;
        let _algorithmVersion = await first_proof.algorithmVersion;
        let _proofAuthor = await first_proof.proofAuthor;

        assert.equal(web3.utils.toDecimal(_score), score);
        assert.equal(web3.utils.toDecimal(_diskUsage), diskUsage);
        assert.equal(_algorithmVersion, algorithmVersion);
        assert.equal(web3.utils.toChecksumAddress(_proofAuthor), proofAuthor);

        _score = await second_proof.score;
        _diskUsage = await second_proof.diskUsage;
        _algorithmVersion = await second_proof.algorithmVersion;
        _proofAuthor = await first_proof.proofAuthor;

        assert.equal(web3.utils.toDecimal(_score), score);
        assert.equal(web3.utils.toDecimal(_diskUsage), diskUsage);
        assert.equal(_algorithmVersion, algorithmVersion);
        assert.equal(web3.utils.toChecksumAddress(_proofAuthor), proofAuthor);
    });

    it("Generates proof of Transfer", async function () {
        let supplier = accounts[1];
        let receiver = accounts[2];
        let deposit = 20;
        let isWaste = false;
        let proofType = "ProofTransfer";

        let device = await DepositDevice.at(deviceAddress);

        await device.generateTransferProof(supplier, receiver,
            deposit, isWaste, { from: accounts[0], gas: 6721975 });
        await device.generateTransferProof(supplier, receiver,
            deposit, isWaste, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let second_proof = await device.getTransferProof(hashes.pop());
        let first_proof = await device.getTransferProof(hashes.pop());

        let _supplier = await first_proof.supplier;
        let _receiver = await first_proof.receiver;
        let _deposit = await first_proof.deposit;

        assert.equal(web3.utils.toChecksumAddress(_supplier), supplier);
        assert.equal(web3.utils.toChecksumAddress(_receiver), receiver);
        assert.equal(web3.utils.toDecimal(_deposit), deposit);

        _supplier = await second_proof.supplier;
        _receiver = await second_proof.receiver;
        _deposit = await second_proof.deposit;

        assert.equal(web3.utils.toChecksumAddress(_supplier), supplier);
        assert.equal(web3.utils.toChecksumAddress(_receiver), receiver);
        assert.equal(web3.utils.toDecimal(_deposit), deposit);
    });

    it("Generates proof of Data Wipe", async function () {
        let erasureType = "complete_erasure";
        let erasureResult = true;
        let proofAuthor = accounts[1];
        let proofType = "ProofDataWipe";

        let device = await DepositDevice.at(deviceAddress);

        await device.generateDataWipeProof(erasureType, erasureResult,
            proofAuthor, { from: accounts[0], gas: 6721975 });
        await device.generateDataWipeProof(erasureType, erasureResult,
            proofAuthor, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);
        let second_proof = await device.getDataWipeProof(hashes.pop());
        let first_proof = await device.getDataWipeProof(hashes.pop());

        let _erasureType = await first_proof.erasureType;
        let _eraseureResult = await first_proof.erasureResult;
        let _proofAuthor = await first_proof.proofAuthor;

        assert.equal(_erasureType, erasureType);
        assert.equal(_eraseureResult, erasureResult);
        assert.equal(web3.utils.toChecksumAddress(_proofAuthor), proofAuthor);

        _erasureType = await second_proof.erasureType;
        _eraseureResult = await second_proof.erasureResult;
        _proofAuthor = await second_proof.proofAuthor;

        assert.equal(_erasureType, erasureType);
        assert.equal(_eraseureResult, erasureResult);
        assert.equal(web3.utils.toChecksumAddress(_proofAuthor), proofAuthor);
    });

    it("Generates proof of Recycle", async function () {
        let collectionPoint = "Recicla2";
        let contact = "John";
        let ticket = "2187463785273jhcd";
        let gpsLocation = "41.3851, 2.1734";
        let recyclerCode = "12u3276b3"
        let proofType = "ProofRecycling"

        let device = await DepositDevice.at(deviceAddress);

        await device.generateRecycleProof(collectionPoint, contact, ticket,
            gpsLocation, recyclerCode, { from: accounts[0], gas: 6721975 });
        await device.generateRecycleProof(collectionPoint, contact, ticket,
            gpsLocation, recyclerCode, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let second_proof = await device.getRecycleProof(hashes.pop());
        let first_proof = await device.getRecycleProof(hashes.pop());

        let _collectionPoint = await first_proof.collectionPoint;
        let _contact = await first_proof.contact;
        let _ticket = await first_proof.ticket;
        let _gpsLocation = await first_proof.gpsLocation;
        let _recyclerCode = await first_proof.recyclerCode;

        assert.equal(_collectionPoint, collectionPoint);
        assert.equal(_contact, contact);
        assert.equal(_ticket, ticket);
        assert.equal(_gpsLocation, gpsLocation);
        assert.equal(_recyclerCode, recyclerCode);

        _collectionPoint = await second_proof.collectionPoint;
        _contact = await second_proof.contact;
        _ticket = await second_proof.ticket;
        _gpsLocation = await second_proof.gpsLocation;
        _recyclerCode = await second_proof.recyclerCode;

        assert.equal(_collectionPoint, collectionPoint);
        assert.equal(_contact, contact);
        assert.equal(_ticket, ticket);
        assert.equal(_gpsLocation, gpsLocation);
        assert.equal(_recyclerCode, recyclerCode);


    });

    it("Generates proof of Reuse", async function () {
        let price = 10;
        let receiverSegment = "segment1";
        let idReceipt = "1876323hh823";

        let proofType = "ProofReuse"
        let device = await DepositDevice.at(deviceAddress);

        await device.generateReuseProof(receiverSegment, idReceipt, price,
            { from: accounts[0], gas: 6721975 });
        await device.generateReuseProof(receiverSegment, idReceipt, price,
            { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs(proofType);

        let second_proof = await device.getReuseProof(hashes.pop());
        let first_proof = await device.getReuseProof(hashes.pop());

        let _price = await first_proof.price;
        let _receiverSegment = await first_proof.receiverSegment;
        let _idReceipt = await first_proof.idReceipt;

        assert.equal(web3.utils.toDecimal(_price), price);
        assert.equal(_receiverSegment, receiverSegment);
        assert.equal(_idReceipt, idReceipt);

        _price = await second_proof.price;
        _receiverSegment = await second_proof.receiverSegment;
        _idReceipt = await second_proof.idReceipt;

        assert.equal(web3.utils.toDecimal(_price), price);
        assert.equal(_receiverSegment, receiverSegment);
        assert.equal(_idReceipt, idReceipt);
    });
});

function extractEvents(receipt) {
    return receipt.logs[0].args
}