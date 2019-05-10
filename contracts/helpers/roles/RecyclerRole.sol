pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract RecyclerRole {
  using Roles for Roles.Role;

  event RecyclerAdded(address indexed account);
  event RecyclerRemoved(address indexed account);

  Roles.Role private Recyclers;

  constructor() internal {
    // _addRecycler(msg.sender);
  }

  modifier onlyRecycler() {
    require(isRecycler(msg.sender));
    _;
  }

  function isRecycler(address account) public view returns (bool) {
    return Recyclers.has(account);
  }

  function addRecycler(address account) public onlyRecycler {
    _addRecycler(account);
  }

  function renounceRecycler() public {
    _removeRecycler(msg.sender);
  }

  function _addRecycler(address account) internal {
    Recyclers.add(account);
    emit RecyclerAdded(account);
  }

  function _removeRecycler(address account) internal {
    Recyclers.remove(account);
    emit RecyclerRemoved(account);
  }
}
