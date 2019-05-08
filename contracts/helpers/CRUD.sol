pragma solidity ^0.4.25;

/**
* @title Maintance of list of Available gateways
* @dev see https://bitbucket.org/rhitchens2/soliditycrud
*/

contract CRUDFactory{

  // address routers;
  // address gateways;
  address clients;

  constructor() public {
      // routers = new CRUD('router');
      // gateways = new CRUD('gateway');
      clients = new CRUD('client');
  }

  // function getRouters() public view returns (address addr){
  //     return routers;
  //   }

  // function getGateways() public view returns (address addr){
  //     return gateways;
  // }

  function getClients() public view returns (address addr){
      return clients;
  }

}

contract CRUD{

  //enum DeviceTypes {Router, Gateway}
  //DeviceTypes devices;
  //DeviceTypes constant defaultChoice = DeviceTypes.Router;
  string devicesType = "router";

  struct crudStruct {
    uint256 uid;
    address addr;
    // string ip;
    uint index;
    // uint pricePerMB;
  }

  mapping(string => crudStruct) private crudStructs;
  mapping(uint256 => string) public IDtoIP;
  string[] private crudIndex;
  
  event LogNew(string ip, uint index, address  addr, uint price, uint uid, string devicesType);
  event LogNewPosition(string ip, uint index);
  event LogUpdate(string ip, uint index, address addr, uint price, uint  uid,  string devicesType);
  event LogDelete(string ip, uint index);

  constructor(string _type) public {
    devicesType = _type;
  }

  function exists(string  ip)
    public
    view
    returns(bool isIndeed)
  {
    if( crudIndex.length == 0) return false;
    return ( compareStrings(crudIndex[crudStructs[ip].index], ip));
  }

  // function add(
  //   string ip,
  //   address addr,
  //   uint256 uid,
  //   uint pricePerMB)
  //   public
  //   returns(uint index)
  // {
  //   require(!exists(ip), "The IP does exist");
  //   crudStructs[ip].ip = ip;
  //   crudStructs[ip].addr = addr;
  //   crudStructs[ip].uid   = uid;
  //   crudStructs[ip].pricePerMB = pricePerMB;
  //   crudStructs[ip].index     = crudIndex.push(ip)-1;
  //   IDtoIP[uid] = ip;
  //   emit LogNew(
  //       ip,
  //       crudStructs[ip].index,
  //       addr,
  //       pricePerMB,
  //       uid,
  //       devicesType);
  //   return crudIndex.length-1;
  // }

  // function del(string ip)
  //   public
  //   returns(uint index)
  // {
  //   require(exists(ip), "The IP does not exists");
  //   uint rowToDelete = crudStructs[ip].index;
  //   uint256 uid = crudStructs[ip].uid;
  //   string memory keyToMove = crudIndex[crudIndex.length-1];
  //   crudIndex[rowToDelete] = keyToMove;
  //   crudStructs[keyToMove].index = rowToDelete;
  //   crudIndex.length--;
  //   IDtoIP[uid] = '';
  //   emit LogDelete(ip, rowToDelete);
  //   emit LogNewPosition(keyToMove, index);
  //   return rowToDelete;
  // }

  // function getByIP(string ip)
  //   public
  //   view
  //   returns(uint uid, uint index, address addr, uint pricePerMB)
  // {
  //   require(exists(ip), "The IP does not exists");
  //   return(
  //     crudStructs[ip].uid,
  //     crudStructs[ip].index,
  //     crudStructs[ip].addr,
  //     crudStructs[ip].pricePerMB);
  // }

  // function getByUID(uint256 uid)
  //   public
  //   view
  //   returns(string ip, uint index, address addr, uint pricePerMB)
  // {
  //   string storage _ip = IDtoIP[uid];
  //   require(!compareStrings(_ip,'') && exists(_ip), "The IP is either empty or it does not exist or ");
  //   return(
  //     _ip,
  //     crudStructs[_ip].index,
  //     crudStructs[_ip].addr,
  //     crudStructs[_ip].pricePerMB);
  // }


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
