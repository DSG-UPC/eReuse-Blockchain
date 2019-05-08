const ERC20 = artifacts.require("EIP20");
const MyERC721 = artifacts.require("MyERC721");
const DAO = artifacts.require("DAO");
const CRUD = artifacts.require("CRUD");
const CRUDFactory = artifacts.require("CRUDFactory");
//const EIP20Interface = artifacts.require("EIP20Interface");
//const Ownable = artifacts.require("Ownable");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ERC20, 1000000, 'Reusecoin', 0, 'RCN')
  .then(async function (erc20) {
    await DAO.deployed().then(function(instance){dao=instance})
    console.log("ERC20: " + erc20.address);
    //await dao.setERC20(erc20.address,{from:accounts[0]});
    await dao.setERC20(erc20.address);
    await deployer.deploy(CRUDFactory)
      .then(async function (crudfactory) {
        console.log('crudfactory: '+crudfactory.address);
        // const crudrouter = await crudfactory.getRouters.call();
        // console.log("crudrouter: " + crudrouter);
        // const crudgateway = await crudfactory.getGateways.call();
        // console.log("crudgateway: " + crudgateway);
        const crudclient = await crudfactory.getClients.call();
        console.log("crudclient: " + crudclient);
        // const erc721 = await deployer.deploy(MyERC721, 'GuifiDeviceToken', 'GDT',
        //   DAO.address, crudrouter, crudgateway, crudclient);
        const erc721 = await deployer.deploy(MyERC721, 'ReuseDeviceToken', 'RDT',
          DAO.address, crudclient);
        dao.setERC721(erc721.address);
        console.log('ERC721: '+erc721.address);
      })
  })
};
