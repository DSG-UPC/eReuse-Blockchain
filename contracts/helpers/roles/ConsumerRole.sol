pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract ConsumerRole {
  using Roles for Roles.Role;

  event ConsumerAdded(address indexed account);
  event ConsumerRemoved(address indexed account);

  Roles.Role private Consumers;

  constructor() internal {
    // _addConsumer(msg.sender);
  }

  modifier onlyConsumer() {
    require(isConsumer(msg.sender));
    _;
  }

  function isConsumer(address account) public view returns (bool) {
    return Consumers.has(account);
  }

  function addConsumer(address account) public onlyConsumer {
    _addConsumer(account);
  }

  function renounceConsumer() public {
    _removeConsumer(msg.sender);
  }

  function _addConsumer(address account) internal {
    Consumers.add(account);
    emit ConsumerAdded(account);
  }

  function _removeConsumer(address account) internal {
    Consumers.remove(account);
    emit ConsumerRemoved(account);
  }
}
