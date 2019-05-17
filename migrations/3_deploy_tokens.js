const ERC20 = artifacts.require("EIP20");
const MyERC721 = artifacts.require("MyERC721");
const DAO = artifacts.require("DAO");
const CRUDFactory = artifacts.require("CRUDFactory");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ERC20, 1000000, 'eReusecoin', 0, 'ECN')
  .then(async function (erc20) {
    await DAO.deployed().then(function(instance){dao=instance})
    console.log("ERC20: " + erc20.address);
    await dao.setERC20(erc20.address);
    await deployer.deploy(CRUDFactory)
      .then(async function (crudfactory) {
        console.log('crudfactory: '+crudfactory.address);
        const erc721 = await deployer.deploy(MyERC721, 'eReuseDeviceToken', 'EDT',
          crudfactory.getDevices());
        dao.setERC721(erc721.address);
        console.log('ERC721: '+erc721.address);
      });
  });
};
