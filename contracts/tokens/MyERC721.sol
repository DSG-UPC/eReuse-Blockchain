pragma solidity ^0.4.25;

import "contracts/oracle/OracleAPI.sol";
import "contracts/helpers/CRUD.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
//import "github.com/Arachnid/solidity-stringutils/strings.sol";

//TODO Import owners address from DAO
//???
//?import "contracts/helpers/Owners.sol";??
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable, usingOracle {
  event LogCallback();
  uint constant MAX_STRING_SIZE = 8;

  // CRUD routers;
  // CRUD gateways;
  CRUD clients;

  constructor(string _name, string _symbol, address _lookupContract, address _crudclient)
  ERC721Full(_name, _symbol)
  usingOracle(_lookupContract)
  public
  {
    // routers = CRUD( _crudrouter);
    // gateways = CRUD(_crudgateway);
    clients = CRUD(_crudclient);
  }


//DOC ways to secure that owner owns device for example sharing private key
  /**
   * Mint request to the oracle
   * @dev This function will initatiate the mint process for IPs that are not
   * already registered.
   * @param ip The ip address of the device to be registered
  */
  function requestClientMint(string ip) external payable {
    //TODO how do we prevent users from repeatdly calling this function?
    //Making it payable is one option, but then we should consider that Ether
    //has value inside the network
    //Denies queries for existing MACs to save uncessary requests
    require(!clients.exists(ip), "A client with this IP already exists");
    queryOracle('nodedb^mintClient',msg.sender, ip);
  }


  // /**
  //  * Mint request to the oracle
  //  * @dev This function will initatiate the mint process for IPs that are not
  //  * already registered.
  //  * @param ip The ip address of the device to be registered
  // */
  // function requestRouterMint(string ip) external payable {
  //   //TODO how do we prevent users from repeatdly calling this function?
  //   //Making it payable is one option, but then we should consider that Ether
  //   //has value inside the network
  //   //Denies queries for existing MACs to save uncessary requests
  //   require(!routers.exists(ip), "A router with this IP already exists");
  //   queryOracle('nodedb^mintRouter',msg.sender, ip);
  // }

  // function activateGateway(string _ip) external {
  //   uint id;
  //   uint256 index;
  //   address addr;
  //   uint pricePerMB;
  //   (id, index, addr, pricePerMB) = routers.getByIP(_ip);
  //   require(_isApprovedOrOwner(msg.sender, id), "The token with the given ID cannot be transferred to the given message sender");
  //   gateways.add(_ip, addr, id, pricePerMB);
  // }

  // function getGateways() external view returns(address gateway){
  //   return gateways;
  // }

  // function getRouters() external view returns(address router){
  //   return routers;
  // }

  function getClients() external view returns(address client){
    return clients;
  }

  function __mintClientCallback(uint256 _uid, string _ip, address _address, address _originator) onlyFromOracle external {
    emit LogCallback();
    // clients.add(_ip, _address, _uid, 0);
    _mint(_originator, _uid);
  }

  // function __mintRouterCallback(uint256 _uid, string _ip, address _address, address _originator) onlyFromOracle external {
  //   emit LogCallback();
  //   routers.add(_ip, _address, _uid, 0);
  //   _mint(_originator, _uid);
  // }

  // function updateRouterForwardingPrice(uint256 _uid, uint newForwardingPrice) public {
  //   require(ownerOf(_uid) == msg.sender, "");
  //   routers.updatePricePerMB(_uid, newForwardingPrice);
  // }
}
