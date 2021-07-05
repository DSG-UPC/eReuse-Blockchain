pragma solidity ^0.4.25;

import "contracts/devices/DepositDevice.sol";
import "contracts/DAOInterface.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DeviceFactory {
    DAOInterface public dao;
    mapping(address => address[]) deployed_devices;
    // mapping(string => address[]) registrant_deployed_devices;

    //-------  EVENTS  -------//
    event DeviceCreated(address indexed _deviceAddress);
    

    constructor(address daoAddress) public {
        dao = DAOInterface(daoAddress);
    }

    function createDevice(
        string _uid,
        uint256 _initValue,
        string _registrantData
    ) public returns (address _device) {
        DepositDevice newContract = new DepositDevice(
            _uid,
            msg.sender,
            _initValue,
            address(dao),
            _registrantData
        );
        deployed_devices[msg.sender].push(newContract);
        // registrant_deployed_devices[_registrantData].push(newContract);
        emit DeviceCreated(newContract);
        return newContract;
    }

    function transfer(address current_owner, address new_owner, string current_registrant, string new_registrant) public {
        deleteOwnership(current_owner, current_registrant);
        deployed_devices[new_owner].push(msg.sender);
        // registrant_deployed_devices[new_registrant].push(msg.sender);

        
    }

    function deleteOwnership(address owner, string registrantData) internal {
        uint256 length = deployed_devices[owner].length;
        for (uint256 i = 0; i < length; i++) {
            if (deployed_devices[owner][i] == msg.sender) {
                deployed_devices[owner][i] = deployed_devices[owner][length - 1];
                delete deployed_devices[owner][length - 1];
                deployed_devices[owner].length--;
                break;
            }
        }
        // length = registrant_deployed_devices[registrantData].length;
        // for (uint256 j = 0; j < length; j++) {
        //     if (registrant_deployed_devices[registrantData][j] == msg.sender) {
        //         registrant_deployed_devices[registrantData][j] = registrant_deployed_devices[registrantData][length - 1];
        //         delete registrant_deployed_devices[registrantData][length - 1];
        //         registrant_deployed_devices[registrantData].length--;
        //         break;
        //     }
        // }
    }

    function recycle(address _owner, string _registrantData) public {
        deleteOwnership(_owner, _registrantData);
    }

    function getDeployedDevices()
        public
        view
        returns (address[] _deployed_devices)
    {
        return deployed_devices[msg.sender];
    }

    // function getRegistrantDeployedDevices(string registrantData)
    //     public
    //     view
    //     returns(address[] _registrant_deployed_devices)
    // {
    //     return registrant_deployed_devices[registrantData];
    // }

}