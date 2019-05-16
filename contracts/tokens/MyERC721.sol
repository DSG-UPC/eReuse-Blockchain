pragma solidity ^0.4.25;

import "contracts/helpers/CRUD.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable{
  event LogCallback();
  uint constant MAX_STRING_SIZE = 8;

  ConsumerRole consumers;
  ProducerRole producers;
  RecyclerRole recyclers;
  CRUD devices;

  constructor(string _name, string _symbol, address _crudDevices)
  ERC721Full(_name, _symbol)
  public {
    devices = CRUD(_crudDevices);
    consumers = devices.getConsumers();
    producers = devices.getProducers();
    recyclers = devices.getRecyclers();
  }

  function getDevices() public view returns(address _devices){
    return devices;
  }
  

  function recycle(uint256 uid) public onlyRecycler {
    // Destroy the token
    uint index;
    address owner;
    string memory mac_address;
    (index, owner, mac_address) = devices.getByUID(uid);
    devices.del(uid);
    super._burn(owner, uid);

    // We need to transfer the investment to the recycler.
    // ERC20.transferFrom(renter_investment, renter_account, msg.sender);
  }

  function rent(uint256 uid, address destination) public onlyProducer {
    require(destination != 0x0, "The destination cannot be the 0 address");
    require(consumers.isConsumer(destination), "The destination is not a consumer");
    
    devices.changeOwnership(uid, destination);
    super.transferFrom(msg.sender, destination, uid);

    // We need to transfer the price of the device to the sender.

    // ERC20.transferFrom(initial_investment, destination, msg.sender);
  }

  function pass(uint256 uid, address destination) public onlyConsumer {
    require(destination != 0x0, "The destination cannot be the 0 address");
    require(consumers.isConsumer(destination) || recyclers.isRecycler(destination)
            , "The destination is not a consumer neither a recycler");
    
    devices.changeOwnership(uid, destination);
    super.transferFrom(msg.sender, destination, uid);
    // We need to transfer the initial investment from one consumer to another.

    // ERC20.transferFrom(initial_investment, destination, msg.sender);
  }

  function mint_device(string mac_address) public onlyProducer returns (uint uid) {
    require(!devices.exists_mac(mac_address), "A device with this MAC address already exists");
    uint id = devices.getCount() + 1;
    devices.add(id, mac_address, msg.sender);
    super._mint(msg.sender, id);
    return id;
  }

  modifier onlyConsumer(){
    require(consumers.isConsumer(msg.sender), "Message sender is not a consumer");
    _;
  }

  modifier onlyRecycler(){
    require(recyclers.isRecycler(msg.sender), "Message sender is not a recycler");
    _;
  }

  modifier onlyProducer(){
    require(producers.isProducer(msg.sender), "Message sender is not a producer");
    _;
  }
}
