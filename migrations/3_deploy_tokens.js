const ERC20 = artifacts.require("EIP20");
const MyERC721 = artifacts.require("MyERC721");
const DAO = artifacts.require("DAO");
const CRUDFactory = artifacts.require("CRUDFactory");
const RoleManager = artifacts.require('RoleManager');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ERC20, 1000000, 'Reusecoin', 0, 'RCN')
    .then(async function (erc20) {
      await DAO.deployed().then(function (instance) {
        dao = instance;
      });
      console.log("ERC20: " + erc20.address);
      await dao.setERC20(erc20.address);
      await deployer.deploy(CRUDFactory)
        .then(async function (crudfactory) {
          console.log('crudfactory: ' + crudfactory.address);
          devices = await crudfactory.getDevices.call();
          console.log(devices);
          manager = await deployer.deploy(RoleManager).then(async (manager) => {
            erc721 = await deployer.deploy(MyERC721, 'GuifiDeviceToken', 'GDT',
              devices, erc20.address, manager.address);
            dao.setERC721(erc721.address);
            console.log('ERC721: ' + erc721.address);
          });
        });
    });
};
