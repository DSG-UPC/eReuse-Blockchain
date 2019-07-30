pragma solidity ^0.4.25;

import "./DepositDevice.sol";
import "contracts/DAOInterface.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DeviceFactory is Ownable {
  address devices;
  address public daoAddress;
  DAOInterface public DAOContract;
  address public erc20Address;
  address public erc721Address;
  address public roleManager;

  constructor(address _daoAddress) public {
    daoAddress = _daoAddress;
    DAOContract =  DAOInterface(daoAddress);
    erc20Address = DAOContract.getERC20();
    erc721Address = DAOContract.getERC721();
    roleManager = DAOContract.getRoleManager();
  }


  function createDevice(string _name, uint _initValue) 
  onlyOwner
  public
  returns (address newContract)
  {
    newContract = new DepositDevice(_name,  msg.sender, _initValue, erc20Address ,erc721Address, erc20Address);
    return newContract;
  }

  function kill() public {
    if (msg.sender == Ownable.owner) selfdestruct(owner);
  }

}