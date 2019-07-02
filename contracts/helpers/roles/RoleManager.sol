pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";



contract RoleManager is Ownable{
    Role consumers;
    Role producers;
    Role recyclers;
    Role itads;

    constructor() public {
        consumers = new Role('comsumer');
        producers = new Role('producer');
        recyclers = new Role('recycler');
        itads = new Role('itads');
    }

    function getConsumers() public view returns (Role addr){
        return consumers;
    }

    function getRecyclers() public view returns (Role addr){
        return recyclers;
    }

    function getProducers() public view returns (Role addr){
        return producers;
    }

    function getItads() public view returns (Role addr){
        return itads;
    }

    function addProducer(address _producer) public onlyOwner {
        producers.addMember(_producer);
    }

    function addConsumer(address _consumer) public onlyOwner {
        consumers.addMember(_consumer);
    }

    function addRecycler(address _recycler) public onlyOwner {
        recyclers.addMember(_recycler);
    }

    function addItad(address _itad) public onlyOwner {
        itads.addMember(_itad);
    }

    function delProducer(address _producer) public onlyOwner {
        producers.delMember(_producer);
    }

    function delConsumer(address _consumer) public onlyOwner {
        consumers.delMember(_consumer);
    }

    function delRecycler(address _recycler) public onlyOwner {
        recyclers.delMember(_recycler);
    }

    function delItad(address _itad) public onlyOwner {
        itads.delMember(_itad);
    }

    function isProducer(address _producer) public view returns(bool) {
        return producers.isMember(_producer);
    }

    function isConsumer(address _consumer) public view returns(bool) {
        return consumers.isMember(_consumer);
    }

    function isRecycler(address _recycler) public view returns(bool) {
        return recyclers.isMember(_recycler);
    }

    function isItad(address _itad) public view returns(bool) {
        return itads.isMember(_itad);
    }

    modifier onlyProducer() {
    require(producers.isMember(msg.sender), "The message sender is not a recycler");
    _;
    }

    modifier onlyConsumer() {
    require(consumers.isMember(msg.sender), "The message sender is not a recycler");
    _;
    }

    modifier onlyRecycler() {
    require(recyclers.isMember(msg.sender), "The message sender is not a recycler");
    _;
    }

    modifier onlyItad() {
    require(itads.isMember(msg.sender), "The message sender is not a recycler");
    _;
    }
}

contract Role is Ownable {
  using Roles for Roles.Role;

  event MemberAdded(string indexed role, address account);
  event MemberRemoved(string indexed role, address account);

  Roles.Role private Members;

  string role;

  constructor(string _role) public {
    role = _role;
  }

  modifier onlyMember() {
    require(isMember(msg.sender), "The message sender is not a recycler");
    _;
  }

  function isMember(address account) public view returns (bool) {
    return Members.has(account);
  }

  function addMember(address account) public onlyOwner {
    require(!isMember(account), "This account has already been registered as a recycler");
    _addMember(account);
  }

  function delMember(address account) public onlyOwner {
    _delMember(account);
  }

  function _addMember(address account) internal {
    Members.add(account);
    emit MemberAdded(role, account);
  }

  function _delMember(address account) internal {
    Members.remove(account);
    emit MemberRemoved(role, account);
  }
}