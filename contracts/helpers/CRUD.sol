pragma solidity ^0.4.25;

/**
* @title Maintance of list of Available gateways
* @dev see https://bitbucket.org/rhitchens2/soliditycrud
*/

import 'contracts/helpers/roles/ProducerRole.sol';
import 'contracts/helpers/roles/ConsumerRole.sol';
import 'contracts/helpers/roles/RecyclerRole.sol';

contract CRUDFactory{

  address devices;

  constructor() public {
    devices = new CRUD();
  }
  
  function getDevices() public view returns (address addr){
    return devices;
  }
}

contract CRUD{

  struct crudStruct {
    uint256 uid;
    address owner;
    address wallet;
    uint index;
    string mac_address;
    uint price;
    uint amount;
  }

  event LogAdd(uint256 uid, string mac_address, address owner, address wallet, uint price, uint amount, uint index);
  event LogDel(uint256 uid, address wallet);
  event LogChangeOwner(uint256 uid, address owner, address owner_new);


  mapping(uint256 => crudStruct) private crudStructs;
  mapping(string => uint256) private mac_to_uid;
  mapping(address => uint256) private wallet_to_uid;
  mapping(uint256 => address[]) private historicalOwners;
  uint256[] private crudIndex;

  constructor() public {}

  function exists(uint256 uid) public view returns(bool isIndeed) {
    if(crudIndex.length == 0)
      return false;
    return crudIndex[crudStructs[uid].index] == uid;
  }

  function exists_wallet(address wallet) public view returns(bool isIndeed) {
    if(crudIndex.length == 0)
      return false;
    return wallet_to_uid[wallet] != 0;
  }

  function exists_mac(string mac_address) public view returns(bool isIndeed) {
    require(!compareStrings(mac_address, ""), "The received MAC address is not valid");
    if(crudIndex.length == 0)
      return false;
    return mac_to_uid[mac_address] != 0;
  }

  function add(uint256 uid, string mac_address, address owner, address wallet, uint price) public{
    require(!exists_mac(mac_address), "This MAC address already exists");
    require(!exists_wallet(wallet), "This wallet already exists");
    require(!exists(uid), "This id already exists");
    require(owner != address(0), "The owner address is the zero address");
    crudStructs[uid].uid = uid;
    crudStructs[uid].owner = owner;
    crudStructs[uid].wallet = wallet;
    crudStructs[uid].mac_address = mac_address;
    crudStructs[uid].price = price;
    crudStructs[uid].amount = price / 10;
    crudStructs[uid].index = crudIndex.push(uid)-1;
    mac_to_uid[mac_address] = uid;
    wallet_to_uid[wallet] = uid;
    historicalOwners[uid].push(owner);
    emit LogAdd(
        uid,
        mac_address,
        owner,
        wallet,
        price,
        crudStructs[uid].amount,
        crudStructs[uid].index);
  }

  function del(uint256 uid, address from) public{
    require(exists(uid), "The ID does not exists");
    require(crudStructs[uid].owner == from
            , "The sender of the request is not the owner of the device");
    uint rowToDelete = crudStructs[uid].index;
    address wallet = crudStructs[uid].wallet;
    string storage mac = crudStructs[uid].mac_address;
    uint keyToMove = crudIndex[crudIndex.length-1];
    crudIndex[rowToDelete] = keyToMove;
    crudStructs[keyToMove].index = rowToDelete;
    mac_to_uid[mac] = 0;
    wallet_to_uid[wallet] = 0;
    crudIndex.length--;
    emit LogDel(
        uid,
        wallet);
  }

  function getByUID(uint256 uid) public view
  returns(uint index, address owner, address _wallet, uint price, string mac_address){
    require(exists(uid), "The ID does not exist");
    address _owner = crudStructs[uid].owner;
    require((_owner != address(0)), "The owner address is either empty or it does not exist");
    return(
      crudStructs[uid].index,
      _owner,
      crudStructs[uid].wallet,
      crudStructs[uid].price,
      crudStructs[uid].mac_address);
  }

  function getByMacAddress(string mac) public view
  returns(uint256 id, uint index, address owner, address _wallet, uint price){
    require(exists_mac(mac), "The ID does not exist");
    uint256 uid = mac_to_uid[mac];
    return(
      uid,
      crudStructs[uid].index,
      crudStructs[uid].owner,
      crudStructs[uid].wallet,
      crudStructs[uid].price);
  }

  function getByWallet(address wallet) public view
  returns(uint256 id, uint index, address owner, string mac_address, uint price){
    require(exists_wallet(wallet), "The ID does not exist");
    uint256 uid = wallet_to_uid[wallet];
    return(
      uid,
      crudStructs[uid].index,
      crudStructs[uid].owner,
      crudStructs[uid].mac_address,
      crudStructs[uid].price);
  }

  function changeOwnership(uint256 uid, address to, uint amount) public {
    require(exists(uid), "A token with that ID does not exist");
    this.withdraw(uid, amount);
    address from = crudStructs[uid].owner;
    crudStructs[uid].owner = to;
    historicalOwners[uid].push(to);
    emit LogChangeOwner(
        uid,
        from,
        to);
  }


  function getCount() public view returns(uint count){
    return crudIndex.length;
  }

  function getAmount(uint uid) public view returns (uint _amount){
    return crudStructs[uid].amount;
  }

  function withdraw(uint uid, uint amount) public{
    require(crudStructs[uid].amount >= amount, "Cannot withdraw more than the maximum value");
    crudStructs[uid].amount -= amount;
  }

  function getAtIndex(uint index) public view returns(uint256 uid){
    return crudIndex[index];
  }
  
  function getHistoricalOwners(uint256 uid) public view returns(address[] owners){
    return historicalOwners[uid];
  }

  function getDeviceWallet(uint uid) public view returns(address _wallet){
    return crudStructs[uid].wallet;
  }

  function compareStrings (string a, string b) public pure returns (bool){
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }

}
