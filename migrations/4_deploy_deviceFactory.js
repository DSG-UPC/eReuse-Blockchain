const DeviceFactory = artifacts.require("DeviceFactory")
const DAO = artifacts.require("DAO");

module.exports = async function (deployer, network, accounts) {
    await DAO.deployed()
    .then(async function (instance) {
        dao = instance;
        await deployer.deploy(DeviceFactory, dao.address,  {from:accounts[0]})
        .then(async function (deviceFactory){
            console.log("Device Factory: " + deviceFactory.address);
        })
    });
}