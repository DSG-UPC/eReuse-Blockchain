const DeviceFactory = artifacts.require("DeviceFactory");
const DAO = artifacts.require("DAO");

module.exports = async (deployer, network, accounts) => {
    await DAO.deployed()
        .then(async function (instance) {
            dao = instance;
            await deployer.deploy(DeviceFactory, dao.address, { from: accounts[0], gas:8000000 })
                .then(async function (deviceFactory) {
                    await dao.setDeviceFactory(deviceFactory.address);
                });
        });
};