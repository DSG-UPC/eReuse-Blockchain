/*jshint esversion: 8 */

const MyERC721 = artifacts.require("MyERC721");
const ERC20 = artifacts.require('EIP20');
const DAO = artifacts.require('DAO');
const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const DeliveryNote = artifacts.require('DeliveryNote');
const assert = require('assert');
const web3 = require('web3')


const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Basic test with two owners and two device", function (accounts) {
    const price = 10;
    // const initalTokens = 20;
    var erc20, dao, factory, delivery_note, device_addresses, deviceA, deviceB, devices
    
    /// INITIALIZE ACCOUNTS ///
    const accs = {
        'ownerA': accounts[1],
        'ownerB': accounts[2],
        'ownerC': accounts[3],
        'ownerD': accounts[4],
    };
    console.log('');
    Object.keys(accs).map(a => {console.log(`${a}: ${accs[a]}`);})

    before(async function() {
        console.log('\t**BEFORE**');
        erc20 = await ERC20.deployed();
        dao = await DAO.deployed();
        factory = await DeviceFactory.deployed();

        await printBalances(erc20,accs)
        console.log(`\tTransfering Tokens...`);
        /// TRANSFER TOKENS TO THE PARTICIPANTS
        for (i in Object.values(accs)) {
            await erc20.transfer(Object.values(accs)[i], 2 * price, { from: accounts[0] });
        }
        await printBalances(erc20,accs)
    });

    it("Creates 2 devices and assings them to msg.sender", async function() {
        // console.log(`\t***Creates 2 devices and assigns them to msg.sender***`);
        await factory.createDevice("deviceA", price, accs.ownerA);
        await factory.createDevice("deviceB", price, accs.ownerA);
        device_addresses = await factory.getDeployedDevices({ from: accs.ownerA }).then(devices => {
            return devices;
        });
        deviceA = await DepositDevice.at(device_addresses[0])
        deviceB = await DepositDevice.at(device_addresses[1])
        devices = [deviceA,deviceB]
        console.log(devices.length);
        
        
        assert.equal(device_addresses.length, devices.length);
        for (i in devices) {
            // Check Device onwer is OwnerA
            assert.equal(accs.ownerA, await devices[i].owner.call())
            // Check Devices have correct deposit
            assert.equal(price, await devices[i].getDeposit.call())
        }
        await printDeviceOwners(device_addresses);
    });

    it("OwnerA transfers devices to DeliveryNote and emits it", async function () {
        /// CREATE FIRST DELIVERY NOTE
        delivery_note = await DeliveryNote.new(accs.ownerB, dao.address, { from: accs.ownerA });
        console.log(`\tDelivery Note: ${delivery_note.address}`);

        /// ADDING EACH DEVICE TO THE NEW DELIVERY NOTE ///
        console.log('\tBefore adding to delivery note');
        await printDeviceOwners(device_addresses);

        for (let addr of device_addresses) {
            let device_instance = await DepositDevice.at(addr);
            // console.log(delivery_note.address, accs.ownerA);
            await device_instance.addToDeliveryNote(delivery_note.address, { from: accs.ownerA, gas: 500000 });
        }

        /// CREATING AND EMITTING THE DELIVERY NOTE ///
        await delivery_note.emitDeliveryNote({ from: accs.ownerA });
        await erc20.approve(delivery_note.address, devices.length * price, { from: accs.ownerB });
        for (i in devices) {
            // Check Device onwer is DeliveryNote
            assert.equal(delivery_note.address, await devices[i].owner.call())
        }
    });

    it("OwnerB accepts to DeliveryNote", async function () {
        console.log('\tBefore accepting delivery note');
        await printBalances(erc20, accs);
        await printDeviceOwners(device_addresses);

        await delivery_note.acceptDeliveryNote({ from: accs.ownerB });
        // devicesB = await factory.getDeployedDevices({ from: accs.ownerB });

        console.log('\tAfter accept delivery note');

        for (i in devices) {
            // Check Device onwer is DeliveryNote
            assert.equal(accs.ownerB, await devices[i].owner.call())
            // Check Device has the promised tokens
            let deviceTokens = web3.utils.toDecimal(await erc20.balanceOf(devices[i].address))
            assert.equal(deviceTokens, price)
        }
        let ownerBTokens = web3.utils.toDecimal(await erc20.balanceOf(accs.ownerB))
        console.log(20 - price*devices.length);
        
        // Check ownerB does not have the spent tokens
        assert.equal(ownerBTokens, 20 - price*devices.length)
        await printBalances(erc20, accs);
        
        await printDeviceOwners(device_addresses);
    })

});
async function printBalances(erc20, accounts) {
    console.log('\n\t BALANCES');
    for (let i in accounts) {
        await erc20.balanceOf(accounts[i]).then(x => {
            console.log(`\t${i} balance: ${x}`);
        });
    }
}

async function printDeviceOwners(devices) {
    console.log('\n\t OWNERS');
    for (let i in devices) {
        let device = await DepositDevice.at(devices[i]);
        let owner = await device.owner.call();
        console.log(`\tDevice: ${devices[i]}\tOwner:${owner}`);
    }
}