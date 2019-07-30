const DeviceFactory = artifacts.require("DeviceFactory")
const DAO = artifacts.require("DAO");

module.exports = function (deployer, network, accounts) {
    await DAO.deployed().then(function (instance) {
        dao = instance;
        deployer.deploy(DeviceFactory, dao,  {from:accounts[0]})
        .then(async function (deviceFactory){
            console.log("Device Factory: " + deviceFactory.address);
        })
    });
}