pragma solidity ^0.4.25;

import "contracts/helpers/CRUD.sol";
import "contracts/tokens/EIP20Interface.sol";
import "contracts/helpers/roles/RoleManager.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable{
  RoleManager manager;
  CRUD devices;
  EIP20Interface erc20;

  constructor(string _name, string _symbol, address _crudDevices, address _erc20, address _manager)
  ERC721Full(_name, _symbol)
  public {
    devices = CRUD(_crudDevices);
    erc20 = EIP20Interface(_erc20);
    manager = RoleManager(_manager);
  }

  function getDevices() public view returns(address _devices){
    return devices;
  }

  function getERC20() public view returns(address _erc20){
    return erc20;
  }

  function getManager() public view returns(address _manager){
    return manager;
  }
  
  function recycle(uint256 uid) public onlyRecycler {
    // Destroy the token
    uint index;
    address owner;
    address device;
    uint price;
    string memory mac_address;
    (index, owner, device, price, mac_address) = devices.getByUID(uid);
    devices.del(uid, msg.sender);
    _burn(device, uid);

    // We need to transfer the investment to the recycler.
    uint amount = devices.getAmount(uid);
    devices.withdraw(uid, amount);
    erc20.transferFrom(device, msg.sender, amount);
  }

  function rent(uint256 uid, address destination, uint benefit) public onlyProducer {
    require(destination != address(0), "The destination cannot be the 0 address");
    require(manager.isConsumer(destination), "The destination is not a consumer");
    
    devices.changeOwnership(uid, destination);
    erc20.transferFrom(destination, msg.sender, benefit);
  }

  function requestProducerMint(address _producer) public {
    require(_producer != address(0), "The address provided is not valid");
    manager.addProducer(_producer);
  }

  function requestConsumerMint(address _consumer) public {
    require(_consumer != address(0), "The address provided is not valid");
    manager.addConsumer(_consumer);
  }

  function requestRecyclerMint(address _recycler) public {
    require(_recycler != address(0), "The address provided is not valid");
    manager.addRecycler(_recycler);
  }

  function pass(uint256 uid, address destination, uint benefit) public onlyConsumer {
    require(destination != address(0), "The destination cannot be the 0 address");
    require(manager.isConsumer(destination) || manager.isRecycler(destination)
            , "The destination is not a consumer neither a recycler");
    
    devices.changeOwnership(uid, destination);
    devices.withdraw(uid, benefit);
    address _device = devices.getDeviceWallet(uid);

    // We need to transfer the initial investment from one consumer to another.
    erc20.transferFrom(_device, msg.sender, benefit);
  }

  function mint_device(string mac_address, address _device, uint price) public onlyProducer 
  {
    require(!devices.exists_mac(mac_address), "A device with this MAC address already exists");
    uint id = devices.getCount() + 1;
    devices.add(id, mac_address, msg.sender, _device, price);
    _mint(_device, id);
    uint amount = price / 10;
    
    erc20.transferFrom(msg.sender, _device, amount);
  }

  modifier onlyProducer{
    require(manager.isProducer(msg.sender), "This request was not originated by a Producer");
    _;
  }

  modifier onlyConsumer{
    require(manager.isConsumer(msg.sender), "This request was not originated by a Consumer");
    _;
  }

  modifier onlyRecycler{
    require(manager.isRecycler(msg.sender), "This request was not originated by a Recycler");
    _;
  }
}
