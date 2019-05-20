pragma solidity ^0.4.25;

import "contracts/helpers/CRUD.sol";
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, Ownable{
  event DeviceMint(uint uid, address wallet, address owner, string mac_address);
  event DeviceRent(uint uid, address newOwner);
  event DevicePass(uint uid, address newOwner);
  event DeviceRecycle(uint uid);
  CRUD devices;

  constructor(string _name, string _symbol, address _crudDevices)
  ERC721Full(_name, _symbol)
  public {
    devices = CRUD(_crudDevices);
  }

  function getDevices() public view returns(address _devices){
    return devices;
  }

  function recycle(uint256 uid, address old_owner)
  external {
    // Destroy the token
    uint index;
    address owner;
    address wallet;
    string memory mac_address;
    uint price;
    (index, owner, wallet, mac_address, price) = devices.getByUID(uid);
    devices.del(uid, old_owner);
    super._burn(owner, uid);

    emit DeviceRecycle(uid);
  }

  function rent(uint256 uid, address old_owner, address destination)
  external{
    devices.changeOwnership(uid, old_owner, destination);
    super.transferFrom(old_owner, destination, uid);

    emit DeviceRent(uid, destination);
  }

  function pass(uint256 uid, address old_owner, address destination)
  external{
    devices.changeOwnership(uid, old_owner, destination);
    super.transferFrom(old_owner, destination, uid);
    
    emit DevicePass(uid, destination);
  }

  function mint_device(string mac_address, address owner, address approved, address wallet, uint price)
  external
  returns (uint uid) {
    uint id = devices.getCount() + 1;
    devices.add(id, mac_address, approved, wallet, price);
    super._mint(owner, id);
    emit DeviceMint(id, wallet, approved, mac_address);
    return id;
  }

  function clearApproval(address destination, uint uid) external {
    this.clearApproval(destination, uid);
  }
}
