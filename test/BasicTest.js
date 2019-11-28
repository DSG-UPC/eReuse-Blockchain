/*jshint esversion: 8 */

const MyERC721 = artifacts.require("MyERC721");
const ERC20 = artifacts.require('EIP20');
const DAO = artifacts.require('DAO');
const DeviceFactory = artifacts.require('DeviceFactory');
const DepositDevice = artifacts.require('DepositDevice');
const DeliveryNote = artifacts.require('DeliveryNote');


const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network']
    });
const network = argv.network;

contract("Basic test with two owners and two device", async function (accounts) {

    // it("New device is created and ownerA transfers to ownerB (without delivery note)", async function () {

    //     price = 10;

    //     accs = {
    //         'ownerA': accounts[1],
    //         'ownerB': accounts[2]
    //     };

    //     token = await MyERC721.deployed();
    //     erc20 = await ERC20.deployed();
    //     dao = await DAO.deployed();
    //     factory = await DeviceFactory.deployed();

    //     await erc20.transfer(accs.ownerA, price, { from: accounts[0] });
    //     await erc20.transfer(accs.ownerB, price, { from: accounts[0] });

    //     /// CREATE THE DEVICE ///

    //     await factory.createDevice("device", 10, accs.ownerA);
    //     device_address = await factory.getDeployedDevices({ from: accs.ownerA }).then(devices => {
    //         return devices[0];
    //     });

    //     await erc20.transfer(device_address, price, { from: accs.ownerA });

    //     console.log('\n## BALANCES INITIALLY ##\n');
    //     await printBalances(erc20, accs);

    //     /// TRANSFER DEVICE ///

    //     await erc20.transfer(device_address, price, { from: accs.ownerB });
    //     factory.transfer(device_address, { from: accs.ownerB });

    //     console.log('\n## BALANCES AFTER OWNERS TRANSFER ##\n');
    //     await printBalances(erc20, accs);

    // });

    it("New device is created and ownerA transfers to ownerB through DeliveryNote)", async function () {

        price = 10;

        accs = {
            'ownerA': accounts[1],
            'ownerB': accounts[2]
        };

        token = await MyERC721.deployed();
        erc20 = await ERC20.deployed();
        dao = await DAO.deployed();
        factory = await DeviceFactory.deployed();

        await erc20.transfer(accs.ownerA, 2 * price, { from: accounts[0] });
        await erc20.transfer(accs.ownerB, 2 * price, { from: accounts[0] });


        /// CREATE THE DEVICE ///

        await factory.createDevice("deviceA", price, accs.ownerA);
        await factory.createDevice("deviceB", price, accs.ownerA);
        device_addresses = await factory.getDeployedDevices({ from: accs.ownerA }).then(devices => {
            return devices;
        });
        // console.log(`Device addresses ${device_addresses}`);


        delivery_note = await DeliveryNote.new(accs.ownerB, dao.address, { from: accs.ownerA });

        // console.log(`Delivery note ${JSON.stringify(delivery_note)}`);

        /// ADDING EACH DEVICE TO THE NEW DELIVERY NOTE ///

        for (let addr of device_addresses) {
            let device_instance = await DepositDevice.at(addr);
            // console.log(delivery_note.address, accs.ownerA);
            await device_instance.addToDeliveryNote(delivery_note.address, { from: accs.ownerA, gas: 500000 });
        }

        /// CREATING AND EMITTING THE DELIVERY NOTE ///

        await delivery_note.emitDeliveryNote({ from: accs.ownerA });
        await erc20.approve(delivery_note.address, 2 * price, { from: accs.ownerB });

        /// ACCEPTING THE DELIVERY NOTE ///

        
        console.log('Before accept delivery note');
        await printBalances(erc20, accs);

        await delivery_note.acceptDeliveryNote({ from: accs.ownerB });
        devicesB = await factory.getDeployedDevices({ from: accs.ownerB });
        console.log(devicesB);

        console.log('Before accept delivery note');

        await printBalances(erc20, accs);

    });

});
async function printBalances(erc20, accounts) {
    for (let i in accounts) {
        await erc20.balanceOf(accounts[i]).then(x => {
            console.log(`${i} balance: ${x}\n`);
        });
    }
}