const DAO = artifacts.require("DAO");
const RecycleChain = artifacts.require("RecycleChain");

module.exports = async function (deployer, network, accounts) {
    await DAO.deployed().then((instance) => {
        dao = instance;
    });
    await deployer.deploy(RecycleChain, dao.address).then((chain) => {
        console.log("RecycleChain: " + chain.address);
    });
};
