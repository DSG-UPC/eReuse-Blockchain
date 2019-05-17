pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract ProducerRole {
  using Roles for Roles.Role;

  event ProducerAdded(address indexed account);
  event ProducerRemoved(address indexed account);

  Roles.Role private Producers;

  constructor() public {
  }

  modifier onlyProducer() {
    require(isProducer(msg.sender), "The message sender is not a producer");
    _;
  }

  function isProducer(address account) public view returns (bool) {
    return Producers.has(account);
  }

  function addProducer(address account) public {
    _addProducer(account);
  }

  function renounceProducer() public onlyProducer {
    _removeProducer(msg.sender);
  }

  function _addProducer(address account) internal {
    Producers.add(account);
    emit ProducerAdded(account);
  }

  function _removeProducer(address account) internal {
    Producers.remove(account);
    emit ProducerRemoved(account);
  }
}
