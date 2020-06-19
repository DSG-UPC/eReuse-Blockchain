const DeviceFactory = artifacts.require("DeviceFactory")
const DepositDevice = artifacts.require("DepositDevice")

module.exports = async (deployer, network, accounts) => {
        const deviceFactory = await DeviceFactory.deployed();
        await deviceFactory.createDevice(0, 0, accounts[0]);
        await deviceFactory.createDevice(1, 1, accounts[0]);
        const deviceAddresses = await deviceFactory.getDeployedDevices(
            { from: accounts[0] })
        const device = await DepositDevice.at(deviceAddresses[0])
        const device1 = await DepositDevice.at(deviceAddresses[1])
        let transaction;


        // Proof of Function
        let score = 10;
        let diskUsage = 20;
        let algorithmVersion = 'v3.1';
        let proofAuthor = accounts[1]
        transaction = await device.generateFunctionProof(score, diskUsage,
            algorithmVersion, proofAuthor, { from: accounts[0], gas: 6721975 });
        console.log("Proof of Function")
        console.log('\t', JSON.stringify(transaction.logs))


        // Proof of Transfer
        let supplier = accounts[1];
        let receiver = accounts[2];
        let deposit = 20;
        let isWaste = false;
        transaction = await device.generateTransferProof(supplier, receiver,
            deposit, isWaste, { from: accounts[0], gas: 6721975 });
        console.log("Proof of Transfer")
        console.log('\t', JSON.stringify(transaction.logs))


        // Proof of Transfer for device 1
        deposit = 30;
        isWaste = true;
        transaction = await device.generateTransferProof(supplier, receiver,
            deposit, isWaste, { from: accounts[0], gas: 6721975 });
        console.log("Proof of Transfer (device1)")
        console.log('\t', JSON.stringify(transaction.logs))


        // Proof of Data Wipe
        let erasureType = "complete_erasure";
        let erasureResult = true;
        transaction = await device.generateDataWipeProof(erasureType, erasureResult,
            proofAuthor, { from: accounts[0], gas: 6721975 });
        console.log("Proof of DataWipe")
        console.log('\t', JSON.stringify(transaction.logs))


        // Proof of Recycle
        let collectionPoint = "Recicla2";
        let contact = "John";
        let ticket = "2187463785273jhcd";
        let gpsLocation = "41.3851, 2.1734";
        let recyclerCode = "12u3276b3"
        transaction = await device.generateRecycleProof(collectionPoint, contact,
            ticket, gpsLocation, recyclerCode, { from: accounts[0], gas: 6721975 });
        console.log("Proof of recycle")
        console.log('\t', JSON.stringify(transaction.logs))


        // Proof of Reuse
        let price = 10;
        let receiverSegment = "segment1";
        let idReceipt = "1876323hh823";

        transaction = await device.generateReuseProof(receiverSegment, idReceipt, price,
            { from: accounts[0], gas: 6721975 });
        console.log("Proof of Reuse")
        console.log('\t', JSON.stringify(transaction.logs))


        // Second Proof of Reuse
        price = 11;
        receiverSegment = "segment2";
        idReceipt = "1876323hh824";

        transaction = await device.generateReuseProof(receiverSegment, idReceipt, price,
            { from: accounts[0], gas: 6721975 });
        console.log("2nd Proof of Reuse")
        console.log('\t', JSON.stringify(transaction.logs))
};
