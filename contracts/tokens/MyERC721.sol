pragma solidity ^0.4.25;

import "contracts/oracle/OracleAPI.sol";
import "contracts/helpers/CRUD.sol";
import "contracts/helpers/roles/ConsumerRole.sol";
import "contracts/helpers/roles/ProducerRole.sol";
import "contracts/helpers/roles/RecyclerRole.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable, usingOracle {
  event LogCallback();
  uint constant MAX_STRING_SIZE = 8;

  ConsumerRole consumers;
  ProducerRole producers;
  RecyclerRole recyclers;

  constructor(string _name, string _symbol, address _lookupContract, address _crudconsumer
              , address _crudproducer, address _crudrecycler)
  ERC721Full(_name, _symbol)
  usingOracle(_lookupContract)
  public
  {
    consumers = ConsumerRole();
    producers = ProducerRole();
    recyclers = RecyclerRole();
  }

  /**
   * Mint request for consumers
   * @dev This function will initatiate the mint process for addresses that are not
   * already registered.
   * @param consumer The address of the consumer to be registered
  */
  function requestConsumerMint(address consumer) external payable {
    require(!consumers.isConsumer(consumer), "A consumer with this address already exists");
    consumers.add(consumer);
  }

  /**
   * Mint request for producers
   * @dev This function will initatiate the mint process for producer
   * addresses that are not already registered.
   * @param producer The address of the producer to be registered
  */
  function requestProducerMint(address producer) external payable {
    require(!producers.isProducer(producer), "A producer with this address already exists");
    producers.add(producer);
  }

  /**
   * Mint request for recyclers
   * @dev This function will initatiate the mint process for addresses that are not
   * already registered.
   * @param recycler The address of the recycler to be registered
  */
  function requestRecyclerMint(address recycler) external payable {
    require(!recyclers.isRecycler(recycler), "A recycler with this address already exists");
    recyclers.add(recycler);
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
