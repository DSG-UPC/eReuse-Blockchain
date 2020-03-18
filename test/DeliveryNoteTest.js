const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const DeliveryNote = artifacts.require('DeliveryNote');
const DAO = artifacts.require('DAO');
const ERC20 = artifacts.require('EIP20');
const assert = require('assert');
const web3 = require('../ganache-web3');

const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Test for generic proof data", function (accounts) {
    var device_factory, dao, erc20;
    console.log('');

    before(async function () {
        console.log('\t**BEFORE**');
        device_factory = await DeviceFactory.deployed();
        erc20 = await ERC20.deployed();
        dao = await DAO.deployed();
    });

    it("Generates a new DeliveryNote and initiates the transfer", async function () {
        let sender = accounts[1];
        let receiver = accounts[2];
        let deposit = 10;

        await device_factory.createDevice("device", 0, sender, 0);
        await device_factory.createDevice("device2", 0, sender, 1);

        let devices = await device_factory.getDeployedDevices(
            { from: sender }).then(devices => {
                return devices;
            });

        let dnote = await DeliveryNote.new(receiver, dao.address, { from: sender })
        let device1 = await DepositDevice.at(devices[0])
        let device2 = await DepositDevice.at(devices[1])

        await device1.addToDeliveryNote(dnote.address, { from: sender })
        await device2.addToDeliveryNote(dnote.address, { from: sender })

        await dnote.emitDeliveryNote({ from: sender })

        await erc20.approve(dnote.address, deposit, { from: receiver })

        await dnote.acceptDeliveryNote(deposit, { from: receiver })

        // let function_hash = await device.getProofs("function");
        // let transfer_hash = await device.getProofs("transfer");

        // let first_proof = await device.getProof(function_hash[0], "function");
        // let second_proof = await device.getProof(transfer_hash[0], "transfer");

        // console.log(`First proof: ${web3.utils.toDecimal(first_proof.block_number)}`);
        // console.log(`Second proof: ${web3.utils.toDecimal(second_proof.block_number)}`);
    });
});

function extractEvents(receipt) {
    return receipt.logs[0].args
}
