pragma solidity ^0.4.25;

import "contracts/devices/DepositDevice.sol";
import "contracts/DAOInterface.sol";
import "contracts/LifeCycleEvent.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract DeviceFactory is LifeCycleEvent {
    DAOInterface public dao;
    mapping(address => address[]) deployed_devices;

    constructor(address daoAddress) public {
        dao = DAOInterface(daoAddress);
    }

    function createDevice(
        uint256 _uid,
        uint256 _initValue,
        address _owner
    ) public returns (address _device) {
        DepositDevice newContract = new DepositDevice(
            _uid,
            _owner,
            _initValue,
            address(dao)
        );
        deployed_devices[_owner].push(newContract);
        emit LifeCycleAction(
            _uid,
            "Register Device",
            "DeviceFactory",
            msg.sender,
            address(this),
            block.timestamp
        );
        return newContract;
    }

    function transfer(address current_owner, address new_owner) public {
        deleteOwnership(current_owner);
        deployed_devices[new_owner].push(msg.sender);
    }

    function deleteOwnership(address owner) internal {
        uint256 length = deployed_devices[owner].length;
        for (uint256 i = 0; i < length; i++) {
            if (deployed_devices[owner][i] == msg.sender) {
                deployed_devices[owner][i] = deployed_devices[owner][length -
                    1];
                delete deployed_devices[owner][length - 1];
                deployed_devices[owner].length--;
                break;
            }
        }
    }

    function recycle(address _owner) public {
        deleteOwnership(_owner);
    }

    function getDeployedDevices()
        public
        view
        returns (address[] _deployed_devices)
    {
        return deployed_devices[msg.sender];
    }
}
