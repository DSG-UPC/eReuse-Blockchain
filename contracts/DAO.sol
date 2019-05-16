pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "contracts/helpers/roles/ConsumerRole.sol";
import "contracts/helpers/roles/ProducerRole.sol";
import "contracts/helpers/roles/RecyclerRole.sol";
import "contracts/DAOInterface.sol";

contract DAO is Ownable {
  address public ERC20;
  address public ERC721;
  address public Owners;
  address public OracleQuery;
  address OracleResponse;
  address ReserveAccount;
  ConsumerRole consumers;
  ProducerRole producers;
  RecyclerRole recyclers;
  // uint256 public pricePerMB;


  constructor(address _OracleQuery)
    public
  {
    OracleResponse = msg.sender;
    OracleQuery = _OracleQuery;
    consumers = new ConsumerRole();
    producers = new ProducerRole();
    recyclers = new RecyclerRole();
  }

  function setOracleQueryAddress(address _address)  public onlyOwner {
    OracleQuery = _address;
  }

  function getOracleQueryAddress() public view returns (address) {
    return OracleQuery;
  }

  function setOracleResponseAddress(address _address) public onlyOwner {
    OracleResponse = _address;
  }

  function getOracleResponseAddress() public view returns (address) {
    return OracleResponse;
  }

  function getERC20() public view returns(address) {
    return ERC20;
  }

  function setERC20(address _address) public onlyOwner returns(bool) {
    ERC20 = _address;
    return true;
  }

  function setERC721(address _address) public onlyOwner returns(bool) {
    ERC721 = _address;
    return true;
  }

  function getERC721() public view returns(address) {
    return ERC721;
  }

  function getOwners() public view returns(address) {
    return Owners;
  }

  function setOwners(address _address) public onlyOwner returns(bool) {
    Owners = _address;
    return true;
  }

  /**
   * Mint request for consumers
   * @dev This function will initatiate the mint process for addresses that are not
   * already registered.
   * @param consumer The address of the consumer to be registered
  */
  function requestConsumerMint(address consumer) public {
    require(!consumers.isConsumer(consumer), "A consumer with this address already exists");
    consumers.addConsumer(consumer);
  }

  /**
   * Mint request for producers
   * @dev This function will initatiate the mint process for producer
   * addresses that are not already registered.
   * @param producer The address of the producer to be registered
  */
  function requestProducerMint(address producer) public {
    require(!producers.isProducer(producer), "A producer with this address already exists");
    producers.addProducer(producer);
  }

  /**
   * Mint request for recyclers
   * @dev This function will initatiate the mint process for addresses that are not
   * already registered.
   * @param recycler The address of the recycler to be registered
  */
  function requestRecyclerMint(address recycler) public {
    require(!recyclers.isRecycler(recycler), "A recycler with this address already exists");
    recyclers.addRecycler(recycler);
  }

  function isRecycler(address owner) view external returns(bool isIndeed){
    return recyclers.isRecycler(owner);
  }

  function isProducer(address owner) view external returns(bool isIndeed){
    return producers.isProducer(owner);
  }

  function isConsumer(address owner) view external returns(bool isIndeed){
    return consumers.isConsumer(owner);
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

}
