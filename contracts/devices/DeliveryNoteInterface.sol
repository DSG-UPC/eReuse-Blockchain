pragma solidity ^0.4.25;

contract DeliveryNoteInterface {
    address sender;
    address receiver;
    uint deposit;
    uint state;
    address[] devices;
    mapping(address => bool) private devicesAdded;
    uint num_devices;

    function addDevice(address _device, address _owner, uint256 _deposit) public;
    function test() public view returns(address);
    function emitDeliveryNote() public;
    function acceptDeliveryNote() public;
    function tranferDevices() internal;
    function transferDevice(address _device, uint _deposit) internal;
}
