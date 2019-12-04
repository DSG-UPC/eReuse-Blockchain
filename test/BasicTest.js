/*jshint esversion: 8 */

const ERC20 = artifacts.require('EIP20');
const DAO = artifacts.require('DAO');
const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const DeliveryNote = artifacts.require('DeliveryNote');
const assert = require('assert');
const web3 = require('web3');


const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Basic test with two owners and two device", function (accounts) {
    const price = 10;
    var erc20, dao, factory, delivery_note, device_addresses, deviceA, deviceB,
        devices, deposit_to_pay;

    /// INITIALIZE ACCOUNTS ///
    const accs = {
        'ownerA': accounts[1],
        'ownerB': accounts[2],
        'ownerC': accounts[3],
        'ownerD': accounts[4],
        'recycler': accounts[5]
    };
    console.log('');
    Object.keys(accs).map(a => { console.log(`${a}: ${accs[a]}`); });

    before(async function () {
        console.log('\t**BEFORE**');
        erc20 = await ERC20.deployed();
        dao = await DAO.deployed();
        factory = await DeviceFactory.deployed();

        await printOwnersBalances(erc20, accs);
        console.log('\n\tTransfering Tokens...');
        /// TRANSFER TOKENS TO THE PARTICIPANTS
        for (let i in Object.values(accs)) {
            await erc20.transfer(Object.values(accs)[i], 2 * price,
                {
                    from: accounts[0]
                });
        }
        await printOwnersBalances(erc20, accs);
    });

    it("Creates 2 devices and assigns them to msg.sender", async function () {
        // console.log(`\t***Creates 2 devices and assigns them to msg.sender***`);
        await factory.createDevice("deviceA", 0, accs.ownerA);
        await factory.createDevice("deviceB", 0, accs.ownerA);
        device_addresses = await factory.getDeployedDevices(
            { from: accs.ownerA }).then(devices => {
                return devices;
            });
        deviceA = await DepositDevice.at(device_addresses[0]);
        deviceB = await DepositDevice.at(device_addresses[1]);
        devices = {
            'deviceA': deviceA,
            'deviceB': deviceB
        };
        // console.log(Object.keys(devices).length);


        assert.equal(device_addresses.length, Object.keys(devices).length,
            "Devices length differ");
        for (let i in devices) {
            // Check Device owner is OwnerA
            assert.equal(accs.ownerA, await devices[i].owner.call());
            // Check Devices have correct deposit
            assert.equal(0, await devices[i].getDeposit.call());
        }
        await printDeviceOwners(device_addresses);
        await printDevicesBalances(erc20, devices);
    });

    it("OwnerA transfers devices to DeliveryNote and emits it", async function () {
        /// CREATE FIRST DELIVERY NOTE
        delivery_note = await DeliveryNote.new(accs.ownerB, dao.address,
            { from: accs.ownerA });
        console.log(`\tDelivery Note: ${delivery_note.address}`);

        /// ADDING EACH DEVICE TO THE NEW DELIVERY NOTE ///
        console.log('\tBefore adding to delivery note');
        await printDeviceOwners(device_addresses);

        for (let addr of device_addresses) {
            let device_instance = await DepositDevice.at(addr);
            await device_instance.addToDeliveryNote(delivery_note.address,
                { from: accs.ownerA, gas: 500000 });
        }

        /// CREATING AND EMITTING THE DELIVERY NOTE ///
        deposit_to_pay = Object.keys(devices).length * price;

        await delivery_note.emitDeliveryNote({ from: accs.ownerA });
        await erc20.approve(delivery_note.address, deposit_to_pay, { from: accs.ownerB });
        for (let i in devices) {
            // Check Device owner is DeliveryNote
            assert.equal(delivery_note.address, await devices[i].owner.call());
        }
        await printDevicesBalances(erc20, devices);
    });

    it("OwnerB accepts to DeliveryNote", async function () {
        console.log('\tBefore accepting delivery note');
        await printOwnersBalances(erc20, accs);
        await printDeviceOwners(device_addresses);

        await delivery_note.acceptDeliveryNote(deposit_to_pay, { from: accs.ownerB });

        console.log('\tAfter accept delivery note');

        // await sleep(2000);

        for (let i in devices) {
            // Check Device owner is DeliveryNote
            assert.equal(accs.ownerB, await devices[i].owner.call());
            // Check Device has the promised tokens
            let cur_balance = await erc20.balanceOf(devices[i].address);
            let deviceTokens = await web3.utils.toDecimal(cur_balance);
            assert.equal(deviceTokens, price);
        }
        let ownerBTokens = web3.utils.toDecimal(await erc20.balanceOf(accs.ownerB));

        // Check ownerB does not have the spent tokens
        assert.equal(ownerBTokens, 20 - price * Object.keys(devices).length);

        await printOwnersBalances(erc20, accs);
        await printDevicesBalances(erc20, devices);
        await printDeviceOwners(device_addresses);
    });

    it("Creates delivery note and recycles the devices", async function () {
        console.log('\tBefore accepting the recycling');
        await printOwnersBalances(erc20, accs);
        await printDeviceOwners(device_addresses);

        delivery_note = await DeliveryNote.new(accs.recycler, dao.address,
            { from: accs.ownerB });

        console.log(`\n\tDelivery Note: ${delivery_note.address}`);

        for (let addr of device_addresses) {
            let device_instance = await DepositDevice.at(addr);
            await device_instance.addToDeliveryNote(delivery_note.address,
                { from: accs.ownerB, gas: 500000 });
        }

        await delivery_note.acceptRecycle({ from: accs.ownerB });

        console.log('\n\tAfter accept recycling of devices');

        let counter_errors = 0;
        for (let addr of device_addresses) {
            try{
                // We try to create instance of the devices
                // with the already known address.
                await DepositDevice.at(addr);

            } catch(error){
                // As the devices were removed from BC, this
                // will raise an error.
                counter_errors++;
            }
        }
        assert.equal(counter_errors, 2, "The devices no longer belong to Blockchain");

        for (let i in accs) {
            let deployed_devs = await factory.getDeployedDevices(
                { from: accs[i] }).then(d => {
                    return d;
                });
            assert.equal(deployed_devs.length, 0,
                `${i} should have 0 deployed devices`);
        }
        let ownerBTokens = await web3.utils.toDecimal(await erc20.balanceOf(accs.ownerB));

        // Check ownerB does not have the spent tokens
        assert.equal(ownerBTokens, price * Object.keys(devices).length);

        await printOwnersBalances(erc20, accs);
    });

});
async function printOwnersBalances(erc20, accounts) {
    console.log('\n\t OWNERS BALANCES');
    for (let i in accounts) {
        await erc20.balanceOf(accounts[i]).then(x => {
            console.log(`\t${i} balance: ${x}`);
        });
    }
}

async function printDevicesBalances(erc20, devices) {
    console.log('\n\t DEVICES BALANCES');
    for (let i in devices) {
        await erc20.balanceOf(devices[i].address).then(x => {
            console.log(`\t${i} balance: ${x}`);
        });
    }
}

async function printDeviceOwners(devices) {
    console.log('\n\t DEVICE OWNERS');
    for (let i in devices) {
        let device = await DepositDevice.at(devices[i]);
        let owner = await device.owner.call();
        console.log(`\tDevice: ${devices[i]}\tOwner:${owner}`);
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}