const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const assert = require('assert');
const web3 = require('web3');

const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Basic test to generate proofs", function (accounts) {
    var device_factory, device_address, device, proof_factory, proofs, proof_types;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        device_factory = await DeviceFactory.deployed();
        await device_factory.createDevice("device", 0, accounts[0]);

        device_address = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices[0];
            });
    });

    it("Generates proof of function", async function () {
        let score = 10;
        let usage = 20;

        device = await DepositDevice.at(device_address);
        await device.generateFunctionProof(score, usage);

        let proofs = await device.getProofs("function");

        assert.equal(proofs.length, 1);

        await device.getFunctionProof.call(proofs[0]).then(result => {
            assert.equal(score, result['0']);
            assert.equal(usage, result['1']);
        })
    });

    it("Generates proof of recycling", async function () {
        let collection_point = "Recicla2";
        let date = new Date().toLocaleString();
        let contact = "John";

        device = await DepositDevice.at(device_address);
        await device.generateRecycleProof(collection_point, date, contact);

        let proofs = await device.getProofs("recycle");

        assert.equal(proofs.length, 1);

        device.getRecycleProof.call(proofs[0]).then(result => {
            assert.equal(collection_point, result['0']);
            assert.equal(date, result['1']);
            assert.equal(contact, result['2']);
        })
    });

    it("Generates proof of reuse", async function () {
        // let reu_proof = await proof_factory.generateReuse().then(result => {
        //     return extractProofAddress(result);
        // });

        // await proofs.addProof(web3.utils.toChecksumAddress(device), proof_types.REUSE
        //     , web3.utils.toChecksumAddress(reu_proof));

        // proofs.getProof(web3.utils.toChecksumAddress(device)
        //     , proof_types.REUSE).then(result => {
        //         assert.notEqual(result, null);
        //         assert.equal(result, reu_proof);
        //     });
    });

    it("Generates proof of disposal", async function () {
        let origin = accounts[1];
        let destination = accounts[2];
        let deposit = 10;

        device = await DepositDevice.at(device_address);
        await device.generateDisposalProof(web3.utils.toChecksumAddress(origin)
            , web3.utils.toChecksumAddress(destination), deposit);

        let proofs = await device.getProofs("disposal");

        assert.equal(proofs.length, 1);

        device.getDisposalProof.call(proofs[0]).then(result => {
            assert.equal(origin, result['0']);
            assert.equal(destination, result['1']);
            assert.equal(deposit, result['2']);
        })
    });

    it("Generates proof of data wipe", async function () {
        let erasure_type = "QuickErase";
        let date = new Date().toLocaleString();
        let result = true;

        device = await DepositDevice.at(device_address);
        await device.generateDataWipeProof(erasure_type, date, result);

        let proofs = await device.getProofs("wipe");

        assert.equal(proofs.length, 1);

        device.getDataWipeProof.call(proofs[0]).then(result => {
            assert.equal(erasure_type, result['0']);
            assert.equal(date, result['1']);
            assert.equal(result, result['2']);
        })
    });

});