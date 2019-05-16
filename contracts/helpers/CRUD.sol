pragma solidity ^0.4.25;

import "contracts/helpers/roles/ConsumerRole.sol";
import "contracts/helpers/roles/ProducerRole.sol";
import "contracts/helpers/roles/RecyclerRole.sol";

/**
* @title Maintance of list of Available gateways
* @dev see https://bitbucket.org/rhitchens2/soliditycrud
*/

contract CRUDFactory{

  address devices;

  constructor(address _roleConsumer, address _roleProducer, address _roleRecycler) public {
    devices = new CRUD(_roleConsumer, _roleProducer, _roleRecycler);
  }
  
  function getDevices() public view returns (address addr){
    return devices;
  }

}

contract CRUD{

  struct crudStruct {
    uint256 uid;
    address owner;
    uint index;
    string mac_address;
  }

  ProducerRole private producers;
  RecyclerRole private recyclers;
  ConsumerRole private consumers;

  function getConsumers() public view returns (ConsumerRole addr){
      return consumers;
  }

  function getRecyclers() public view returns (RecyclerRole addr){
      return recyclers;
  }

  function getProducers() public view returns (ProducerRole addr){
      return producers;
  }

  mapping(uint256 => crudStruct) private crudStructs;
  mapping(string => uint256) private mac_to_uid;
  uint256[] private crudIndex;

  constructor(address _roleConsumer, address _roleProducer, address _roleRecycler) public {
    consumers = ConsumerRole(_roleConsumer);
    producers = ProducerRole(_roleProducer);
    recyclers = RecyclerRole(_roleRecycler);
  }
  
  function exists(uint256 uid) public view returns(bool isIndeed) {
    if(crudIndex.length == 0)
      return false;
    return crudIndex[crudStructs[uid].index] == uid;
  }

  function exists_mac(string mac_address) public view returns(bool isIndeed) {
    require(!compareStrings(mac_address, ""), "The received MAC address is not valid");
    if(crudIndex.length == 0)
      return false;
    return mac_to_uid[mac_address] != 0;
  }

  function add(uint256 uid, string mac_address, address owner) public returns(uint index) {
    require(!exists_mac(mac_address), "This MAC address already exists");
    crudStructs[uid].uid = uid;
    crudStructs[uid].owner = owner;
    crudStructs[uid].mac_address = mac_address;
    crudStructs[uid].index = crudIndex.push(uid)-1;
    mac_to_uid[mac_address] = uid;
    return crudIndex.length-1;
  }

  function del(uint256 uid) public returns(uint index){
    require(exists(uid), "The ID does not exists");
    uint rowToDelete = crudStructs[uid].index;
    string storage mac = crudStructs[uid].mac_address;
    uint keyToMove = crudIndex[crudIndex.length-1];
    crudIndex[rowToDelete] = keyToMove;
    crudStructs[keyToMove].index = rowToDelete;
    mac_to_uid[mac] = 0;
    crudIndex.length--;
    return rowToDelete;
  }

  function getByUID(uint256 uid) public view returns(uint index, address addr, string mac_address){
    require(exists(uid), "The ID does not exist");
    address _addr = crudStructs[uid].owner;
    require((_addr != address(0)), "The owner address is either empty or it does not exist");
    return(
      crudStructs[uid].index,
      crudStructs[uid].owner,
      crudStructs[uid].mac_address);
  }

  function changeOwnership(uint256 uid, address to) public {
    require(exists(uid), "A token with that ID does not exist");
    crudStructs[uid].owner = to;
  }

  function getByMacAddress(string mac) public view returns(uint256 id, uint index, address owner){
    require(exists_mac(mac), "The ID does not exist");
    uint256 uid = mac_to_uid[mac];
    return(
      uid,
      crudStructs[uid].index,
      crudStructs[uid].owner);
  }

  function getCount() public view returns(uint count){
    return crudIndex.length;
  }

  function getAtIndex(uint index) public view returns(uint256 uid){
    return crudIndex[index];
  }

  function compareStrings (string a, string b) public pure returns (bool){
       return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }

}
