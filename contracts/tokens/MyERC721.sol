pragma solidity ^0.4.25;

import "contracts/helpers/CRUD.sol";
import "contracts/tokens/EIP20.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable{
  ConsumerRole consumers;
  ProducerRole producers;
  RecyclerRole recyclers;
  CRUD devices;
  EIP20 erc20;

  constructor(string _name, string _symbol, address _crudDevices, address _erc20)
  ERC721Full(_name, _symbol)
  public {
    devices = CRUD(_crudDevices);
    erc20 = EIP20(_erc20);
    consumers = devices.getConsumers();
    producers = devices.getProducers();
    recyclers = devices.getRecyclers();
  }

  function getDevices() public view returns(address _devices){
    return devices;
  }

  function getERC20() public view returns(address _erc20){
    return erc20;
  }
  
  function recycle(uint256 uid) public onlyRecycler {
    // Destroy the token
    uint index;
    address owner;
    address device;
    uint price;
    string memory mac_address;
    (index, owner, device, price, mac_address) = devices.getByUID(uid);
    devices.del(uid);
    _burn(owner, uid);

    // We need to transfer the investment to the recycler.
    uint amount = devices.getAmount(uid);
    devices.withdraw(uid, amount);
    erc20.approve(msg.sender, amount);
    erc20.transferFrom(device, msg.sender, amount);
  }

  function rent(uint256 uid, address destination, uint benefit) public onlyProducer {
    require(destination != 0x0, "The destination cannot be the 0 address");
    require(consumers.isConsumer(destination), "The destination is not a consumer");
    
    devices.changeOwnership(uid, destination, benefit);
    transferFrom(msg.sender, destination, uid);

    address _device = devices.getDeviceAddress(uid);

    // We need to transfer the price of the device to the sender.

    devices.withdraw(uid, benefit);
    erc20.approve(msg.sender, benefit);
    erc20.transferFrom(_device, msg.sender, benefit);
  }

  function pass(uint256 uid, address destination, uint benefit) public onlyConsumer {
    require(destination != 0x0, "The destination cannot be the 0 address");
    require(consumers.isConsumer(destination) || recyclers.isRecycler(destination)
            , "The destination is not a consumer neither a recycler");
    
    devices.changeOwnership(uid, destination, benefit);
    transferFrom(msg.sender, destination, uid);

    address _device = devices.getDeviceAddress(uid);

    // We need to transfer the initial investment from one consumer to another.

    erc20.approve(msg.sender, benefit);
    erc20.transferFrom(_device, msg.sender, benefit);
  }

  function mint_device(string mac_address, address _device, uint price) public onlyProducer returns (uint uid) {
    require(!devices.exists_mac(mac_address), "A device with this MAC address already exists");
    uint id = devices.getCount() + 1;
    devices.add(id, mac_address, msg.sender, _device, price);
    _mint(msg.sender, id);
    uint amount = price / 10;
    erc20.transfer(_device, amount);
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
