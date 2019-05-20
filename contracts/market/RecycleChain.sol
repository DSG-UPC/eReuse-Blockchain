pragma solidity ^0.4.25;

import "contracts/helpers/roles/RoleManager.sol";
import "contracts/tokens/MyERC721.sol";
import "contracts/tokens/EIP20.sol";
import "contracts/DAO.sol";


contract RecycleChain {
  
  RoleManager private manager;
  DAO private dao;
  MyERC721 private erc721;
  EIP20 private erc20;

  constructor(address _dao) public {
    manager = new RoleManager();
    dao = DAO(_dao);
    address _erc20 = dao.getERC20();
    address _erc721 = dao.getERC721();
    erc20 = EIP20(_erc20);
    erc721 = MyERC721(_erc721);
  }

  function getManager()
  external view
  returns(address _manager) {
    return manager;
  }
  
  function mint_device(string mac_address, address wallet, uint price)
  public
  onlyProducer
  returns (uint uid, address _wallet) {
    require(!compareStrings(mac_address, ''), "The MAC address cannot be empty");
    require(wallet != address(0), "The wallet cannot be the 0 address");
    uint id = erc721.mint_device(mac_address, address(this), msg.sender, wallet, price);
    erc721.approve(msg.sender, id);

    // Then ERC20 tasks.
    return (id, wallet);
  }

  function rent(uint256 uid, address destination)
  public
  onlyProducer {
    require(destination != address(0), "The destination cannot be the 0 address");
    require(manager.isConsumer(destination), "The destination is not a consumer");
    erc721.clearApproval(address(this), uid);
    erc721.approve(msg.sender, uid);
    erc721.rent(uid, msg.sender, destination);

    // Then ERC20 tasks.
  }

  function pass(uint256 uid, address destination)
  public
  onlyConsumer {
    require(destination != address(0), "The destination cannot be the 0 address");
    require(manager.isConsumer(destination) || manager.isRecycler(destination)
            , "The destination is not a consumer neither a recycler");
    erc721.clearApproval(address(this), uid);
    erc721.approve(msg.sender, uid);
    erc721.pass(uid, msg.sender, destination);

    // Then ERC20 tasks.
  }

  function recycle(uint256 uid)
  public
  onlyRecycler {
    erc721.clearApproval(address(this), uid);
    erc721.recycle(uid, msg.sender);

    // Then ERC20 tasks.
  }

  /**
   * Mint request for consumers
   * @dev This function will initatiate the mint process for addresses that are not
   * already registered.
   * @param consumer The address of the consumer to be registered
  */
  function requestConsumerMint(address consumer)
  public {
    require(!manager.isConsumer(consumer), "A consumer with this address already exists");
    manager.getConsumers().addConsumer(consumer);
  }

  /**
   * Mint request for producers
   * @dev This function will initatiate the mint process for producer
   * addresses that are not already registered.
   * @param producer The address of the producer to be registered
  */
  function requestProducerMint(address producer)
  public {
    require(!manager.isProducer(producer), "A producer with this address already exists");
    manager.getProducers().addProducer(producer);
  }

  /**
   * Mint request for recyclers
   * @dev This function will initatiate the mint process for addresses that are not
   * already registered.
   * @param recycler The address of the recycler to be registered
  */
  function requestRecyclerMint(address recycler)
  public {
    require(!manager.isRecycler(recycler), "A recycler with this address already exists");
    manager.getRecyclers().addRecycler(recycler);
  }

  modifier onlyConsumer(){
    require(manager.isConsumer(msg.sender), "Message sender is not a consumer");
    _;
  }

  modifier onlyRecycler(){
    require(manager.isRecycler(msg.sender), "Message sender is not a recycler");
    _;
  }

  modifier onlyProducer(){
    require(manager.isProducer(msg.sender), "Message sender is not a producer");
    _;
  }

  function compareStrings (string a, string b) public pure returns (bool){
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }
}
