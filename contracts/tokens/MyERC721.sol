pragma solidity ^0.4.25;

import "contracts/oracle/OracleAPI.sol";
import "contracts/helpers/CRUD.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable, usingOracle {
  event LogCallback();
  uint constant MAX_STRING_SIZE = 8;

  CRUD consumers;
  CRUD producers;
  CRUD recyclers;

  constructor(string _name, string _symbol, address _lookupContract, address _crudconsumer
              , address _crudproducer, address _crudrecycler)
  ERC721Full(_name, _symbol)
  usingOracle(_lookupContract)
  public
  {
    consumers = CRUD(_crudconsumer);
    producers = CRUD(_crudproducer);
    recyclers = CRUD(_crudrecycler);
  }

  /**
   * Mint request to the oracle
   * @dev This function will initatiate the mint process for IPs that are not
   * already registered.
   * @param ip The ip address of the consumer to be registered
  */
  function requestConsumerMint(string ip) external payable {
    require(!consumers.exists(ip), "A consumer with this IP already exists");
    queryOracle('nodedb^mintConsumer', msg.sender, ip);
  }

  /**
   * Mint request to the oracle
   * @dev This function will initatiate the mint process for IPs that are not
   * already registered.
   * @param ip The ip address of the producer to be registered
  */
  function requestProducerMint(string ip) external payable {
    require(!producers.exists(ip), "A producer with this IP already exists");
    queryOracle('nodedb^mintProducer', msg.sender, ip);
  }

  /**
   * Mint request to the oracle
   * @dev This function will initatiate the mint process for IPs that are not
   * already registered.
   * @param ip The ip address of the recycler to be registered
  */
  function requestRecyclerMint(string ip) external payable {
    require(!recyclers.exists(ip), "A recycler with this IP already exists");
    queryOracle('nodedb^mintRecycler', msg.sender, ip);
  }

  function getProducers() external view returns(address producer){
    return producers;
  }

  function getConsumers() external view returns(address consumer){
    return consumers;
  }

  function getRecyclers() external view returns(address recycler){
    return recyclers;
  }

  function __mintProducerCallback(uint256 _uid, string _ip, address _address, address _originator) onlyFromOracle external {
    emit LogCallback();
    producers.add(_ip, _address, _uid);
    super._mint(_originator, _uid);
  }

  function __mintConsumerCallback(uint256 _uid, string _ip, address _address, address _originator) onlyFromOracle external {
    emit LogCallback();
    consumers.add(_ip, _address, _uid);
    super._mint(_originator, _uid);
  }

  function __mintRecyclerCallback(uint256 _uid, string _ip, address _address, address _originator) onlyFromOracle external {
    emit LogCallback();
    recyclers.add(_ip, _address, _uid);
    super._mint(_originator, _uid);
  }

  // function updateRouterForwardingPrice(uint256 _uid, uint newForwardingPrice) public {
  //   require(ownerOf(_uid) == msg.sender, "");
  //   routers.updatePricePerMB(_uid, newForwardingPrice);
  // }
}
