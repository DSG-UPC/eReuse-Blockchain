pragma solidity ^0.4.25;

import "contracts/devices/DepositDevice.sol";
import "contracts/DAOInterface.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "contracts/tokens/EIP20Interface.sol";
// import "contracts/devices/DeliveryNoteInterface.sol";

// contract DeliveryNote is DeliveryNoteInterface,Ownable {
    contract DeliveryNote is Ownable {
    
    /*   Interfaces  */
    EIP20Interface erc20;
    DAOInterface public DAOContract;
    
    /*   Variables  */
    address sender;
    address receiver;
    uint deposit;
    uint state;
    address[] devices;
    mapping(address => bool) private devicesAdded;
    uint num_devices;

    /*   Events  */
    event DeviceAdded( address indexed _device);
    event NoteEmitted(uint256 _deposit);


    constructor(address _receiver, address _daoAddress)
    public
    {
        DAOContract = DAOInterface(_daoAddress);
        address erc20Address = DAOContract.getERC20();
        erc20 = EIP20Interface(erc20Address);
        receiver = _receiver;
        sender = msg.sender;
        num_devices = 0;
        state = 0;
        deposit = 0 ;
    }

    function addDevice(address _device, address _owner, uint256 _deposit)
    public
    {
        require(_device == msg.sender, "The device itelf has to initiate the transaction.");
        require(this.owner() == _owner, "Device that belong to onwers other that the DeliveryNote owner cannot be added.");
        require(!devicesAdded[_device], "This device has already been added to the current Delivery Note.");
        devices.push(_device);
        devicesAdded[_device] = true;
        num_devices++;
        deposit += _deposit;
        
        emit DeviceAdded(_device);
    }

    function emitDeliveryNote()
    public
    onlyOwner 
    {
        state = 1;
        emit NoteEmitted(deposit);
    }

    function acceptDeliveryNote()
    public
    {
        require(state == 1, "The current Delivery Note cannot be accepted if it has not been sent yet.");
        require(msg.sender == receiver, "Only the originally defined receiver can accept a Delivery Note.");
        erc20.transferFrom(msg.sender, address(this), deposit);
        transferDevices();
    }

    function transferDevices()
    internal
    {
        uint deposit_per_device = deposit / num_devices;
        while(num_devices > 0){
            address current_device = devices[num_devices-1];
            transferDevice(current_device, deposit_per_device);
            delete devices[num_devices-1];
            num_devices--;
        }
    }

    function transferDevice(address _device, uint _deposit)
    internal
    {
        erc20.transfer(_device, _deposit);
        DepositDevice device = DepositDevice(_device);
        device.transferDevice(receiver);
    }
}

