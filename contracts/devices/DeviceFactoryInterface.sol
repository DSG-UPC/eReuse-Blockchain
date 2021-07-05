pragma solidity ^0.4.25;

contract DeviceFactoryInterface {
    mapping(address => address[]) deployed_devices;
    mapping(string => address[]) registrant_deployed_devices;

    address public daoAddress;

    function transfer(address current_owner, address _new_owner, string current_registrant, string new_registrant) public;
    function deleteOwnership(address owner, string registrantData) internal;
    function createDevice(string _uid, uint256 _initValue, string _registrantData)
        public
        returns (address _device);
    function recycle(address _owner, string _registrantData) public;
}
