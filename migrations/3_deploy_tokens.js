const ERC20 = artifacts.require("EIP20");
const MyERC721 = artifacts.require("MyERC721");
const DAO = artifacts.require("DAO");
const CRUDFactory = artifacts.require("CRUDFactory");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ERC20, 1000000, 'Reusecoin', 0, 'RCN')
    .then(async function (erc20) {
      await DAO.deployed().then(function (instance) {
        dao = instance;
      });
      console.log("ERC20: " + erc20.address);
      await dao.setERC20(erc20.address);
      await deployer.deploy(CRUDFactory, dao.getConsumers(), dao.getProducers(), dao.getRecyclers())
        .then(async function (crudfactory) {
          console.log('crudfactory: ' + crudfactory.address);
          const crudrecyclers = await dao.getRecyclers.call();
          console.log("crudrecyclers: " + crudrecyclers);
          const crudconsumers = await dao.getConsumers.call();
          console.log("crudconsumers: " + crudconsumers);
          const crudproducers = await dao.getProducers.call();
          console.log("crudproducers: " + crudproducers);
          const erc721 = await deployer.deploy(MyERC721, 'GuifiDeviceToken', 'GDT',
            crudfactory.getDevices(), erc20.address);
          dao.setERC721(erc721.address);
          await erc20.transfer(erc721.address, 100000);
          console.log('ERC721: ' + erc721.address);
        });
    });
};
