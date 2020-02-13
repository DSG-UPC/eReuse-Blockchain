const DeviceFactory = artifacts.require('DeviceFactory');
const ProofFactory = artifacts.require('ProofFactory');
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
        proof_factory = await ProofFactory.deployed();
        proofs = await Proofs.deployed();
        proof_types = {
            WIPE: 0,
            FUNCTION: 1,
            REUSE: 2,
            RECYCLE: 3,
            DISPOSAL: 4
        }

        await device_factory.createDevice("device", 0, accounts[0]);

        device = await device_factory.getDeployedDevices(
            { from: accounts[0] }).then(devices => {
                return devices[0];
            });
    });

    it("Generates proof of function", async function () {
        let score = 10;
        let usage = 20;

        let f_proof = await proof_factory.generateFunction(score, usage).then(result => {
            console.log(result);
            return extractProofAddress(result);
        });

        await proofs.addProof(web3.utils.toChecksumAddress(device)
            , proof_types.FUNCTION, web3.utils.toChecksumAddress(f_proof));

        proofs.getProof(web3.utils.toChecksumAddress(device)
            , proof_types.FUNCTION).then(result => {
                assert.notEqual(result, null);
                assert.equal(result, f_proof);
            });
    });

});

function extractProofAddress(receipt) {
    return receipt.logs[0].args.proof
}