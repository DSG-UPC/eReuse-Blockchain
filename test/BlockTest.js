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

    it("Generates proof of function", async function () {
        let score = 10;
        let diskUsage = 20;
        let algorithmVersion = 'v3.1';

        let device = await DepositDevice.at(deviceAddress);

        await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0], gas: 6721975 });
        await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, { from: accounts[0], gas: 6721975 });

        let hashes = await device.getProofs("function");

        // TESTING FOR PROOF BC INFO (BLOCK_NUM, OWNER, DEVICE_ADDRESS)

        let first_proof = await device.getProof(hashes[0], "function");
        let second_proof = await device.getProof(hashes[1], "function");

        assert.notEqual(first_proof.block_number, second_proof.block_number);

        let handler_first = await handler.getFunctionProof(hashes[0]);
        let handler_second = await handler.getFunctionProof(hashes[1]);

        assert.equal(first_proof.block_number.words[0], handler_first.block_number.words[0]);
        assert.equal(first_proof.device_id, handler_first.device_id);
        assert.equal(first_proof.owner, handler_first.owner);

        assert.equal(second_proof.block_number.words[0], handler_second.block_number.words[0]);
        assert.equal(second_proof.device_id, handler_second.device_id);
        assert.equal(second_proof.owner, handler_second.owner);


        // TESTING FOR PROOF DATA (SCORE, USAGE, ALGORITHM)

        first_proof = await device.getFunctionProof(hashes[0]);
        second_proof = await device.getFunctionProof(hashes[1]);

        handler_first = await handler.getFunctionProofData(hashes[0]);
        handler_second = await handler.getFunctionProofData(hashes[1]);

        assert.equal(web3.utils.toDecimal(first_proof.score), web3.utils.toDecimal(handler_first.score));
        assert.equal(web3.utils.toDecimal(first_proof.diskUsage), web3.utils.toDecimal(handler_first.diskUsage));
        assert.equal(first_proof.algorithmVersion, handler_first.algorithmVersion);

        assert.equal(web3.utils.toDecimal(second_proof.score), web3.utils.toDecimal(handler_second.score));
        assert.equal(web3.utils.toDecimal(second_proof.diskUsage), web3.utils.toDecimal(handler_second.diskUsage));
        assert.equal(second_proof.algorithmVersion, handler_second.algorithmVersion);
    });
});

function extractEvents(receipt) {
    return receipt.logs[0].args
}