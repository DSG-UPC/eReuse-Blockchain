/*jshint esversion: 8 */

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);
const argv = require('minimist')(process.argv.slice(2));
const DeviceFactory = artifacts.require("DeviceFactory");
const DepositDevice = artifacts.require("DepositDevice");
const DAO = artifacts.require("DAO");
const ERC20 = artifacts.require('EIP20');
const RoleManager = artifacts.require('RoleManager');
var msg = argv.msg;

contract("Carry out signing", async function (accounts) {
    it("signs a contract and checks its validity", async function () {

        /*
        * CREATING THE DEVICE
        */

        dao = await DAO.deployed();
        erc20 = await ERC20.deployed();
        manager = await RoleManager.deployed();
        factory = await DeviceFactory.deployed();

        price = 150;
        accounts = {
            'owner': accounts[0],
            'consumer': accounts[1],
            'producer': accounts[2],
            'processor': accounts[3],
            'repairer': accounts[4],
            'itad': accounts[5],
            'notary': accounts[6],
        };

        await addRoles(accounts, manager);

        await factory.createDevice("router", price, accounts.owner, { from: accounts.notary });

        let devices = await factory.getDeployedDevices({ from: accounts.owner });

        let device = await DepositDevice.at(devices[0]);

        device.getOwner().then(o => {
            assert(o == accounts.owner);
            console.log(o);
        });

    });

});

async function addRoles(accounts, manager) {
    manager.addConsumer(accounts.producer);
    manager.addProducer(accounts.consumer);
    manager.addProcessor(accounts.processor);
    manager.addRepairer(accounts.repairer);
    manager.addItad(accounts.itad);
    manager.addNotary(accounts.notary);
}