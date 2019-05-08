pragma solidity ^0.4.25;

/**
* @title Maintance of list of Available gateways
* @dev see https://bitbucket.org/rhitchens2/soliditycrud
*/

contract CRUDFactory{

  address producers;
  address recyclers;
  address consumers;

  constructor() public {
      producers = new CRUD('producers');
      recyclers = new CRUD('recyclers');
      consumers = new CRUD('consumers');
  }

  function getConsumers() public view returns (address addr){
      return consumers;
    }

  function getRecyclers() public view returns (address addr){
      return recyclers;
  }

  function getProducers() public view returns (address addr){
      return producers;
  }

}

contract CRUD{

  enum Roles {Producer, Consumer, Recycler}
  Roles roles;
  Roles constant defaultChoice = Roles.Consumer;
  string role = "consumer";

  struct crudStruct {
    uint256 uid;
    address addr;
    string ip;
    uint index;
  }

  mapping(string => crudStruct) private crudStructs;
  mapping(uint256 => string) public IDtoIP;
  string[] private crudIndex;
  
  event LogNew(string ip, uint index, address  addr, uint uid, string role);
  event LogNewPosition(string ip, uint index);
  event LogUpdate(string ip, uint index, address addr, uint  uid,  string role);
  event LogDelete(string ip, uint index);

  constructor(string _type) public {
    role = _type;
  }

  function exists(string  ip)
    public
    view
    returns(bool isIndeed)
  {
    if( crudIndex.length == 0) return false;
    return ( compareStrings(crudIndex[crudStructs[ip].index], ip));
  }

  function add(string ip, address addr, uint256 uid)
    public
    returns(uint index)
  {
    require(!exists(ip), "The IP does exist");
    crudStructs[ip].ip = ip;
    crudStructs[ip].addr = addr;
    crudStructs[ip].uid   = uid;
    crudStructs[ip].index = crudIndex.push(ip)-1;
    IDtoIP[uid] = ip;
    emit LogNew(
        ip,
        crudStructs[ip].index,
        addr,
        uid,
        role);
    return crudIndex.length-1;
  }

  function del(string ip)
    public
    returns(uint index)
  {
    require(exists(ip), "The IP does not exists");
    uint rowToDelete = crudStructs[ip].index;
    uint256 uid = crudStructs[ip].uid;
    string memory keyToMove = crudIndex[crudIndex.length-1];
    crudIndex[rowToDelete] = keyToMove;
    crudStructs[keyToMove].index = rowToDelete;
    crudIndex.length--;
    IDtoIP[uid] = '';
    emit LogDelete(ip, rowToDelete);
    emit LogNewPosition(keyToMove, index);
    return rowToDelete;
  }

  function getByIP(string ip)
    public
    view
    returns(uint uid, uint index, address addr)
  {
    require(exists(ip), "The IP does not exists");
    return(
      crudStructs[ip].uid,
      crudStructs[ip].index,
      crudStructs[ip].addr);
  }

  function getByUID(uint256 uid) public view
    returns(string ip, uint index, address addr)
  {
    string storage _ip = IDtoIP[uid];
    require(!compareStrings(_ip,'') && exists(_ip), "The IP is either empty or it does not exist or ");
    return(
      _ip,
      crudStructs[_ip].index,
      crudStructs[_ip].addr);
  }


  function getCount()
    public
    view
    returns(uint count)
  {
    return crudIndex.length;
  }

  function getAtIndex(uint index)
    public
    view
    returns(string ip)
  {
    return crudIndex[index];
  }

  function compareStrings (string a, string b) public pure returns (bool){
       return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
   }

}
