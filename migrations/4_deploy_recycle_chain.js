const DAO = artifacts.require("DAO");
const RecycleChain = artifacts.require("RecycleChain");
const ERC20 = artifacts.require("EIP20");
const ERC721 = artifacts.require('MyERC721');

module.exports = async function (deployer, network, accounts) {
    const dao = await DAO.deployed();
    const erc20 = await ERC20.deployed();
    const erc721 = await ERC721.deployed();
    await deployer.deploy(RecycleChain, dao.address).then((chain) => {
        console.log("RecycleChain: " + chain.address);
        erc20.transfer(chain.address, 100000);
    });
};
