pragma solidity ^0.4.25;

import "contracts/devices/DepositDevice.sol";
import "contracts/DAOInterface.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "contracts/tokens/EIP20Interface.sol";

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
    event NoteEmitted(string concept, uint256 _deposit);


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
        emit NoteEmitted("Transfer", deposit);
    }

    function acceptDeliveryNote()
    public
    onlyReceiver
    validState(1)
    {
        erc20.transferFrom(msg.sender, address(this), deposit);
        transferDevices();
    }

    function acceptRecycle()
    public
    onlyOwner
    {
        state = 2;
        emit NoteEmitted("Transfer", deposit);
    }

    function recycleDevices()
    internal
    validState(2)
    {
        while(num_devices > 0){
            address current_device = devices[num_devices-1];
            recycleDevice(current_device);
            delete devices[num_devices-1];
            num_devices--;
        }
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
        device.transferDevice(receiver, _deposit);
    }

    function recycleDevice(address _device)
    internal
    {
        DepositDevice device = DepositDevice(_device);
        device.recycle(msg.sender);
    }

    function kill() internal onlyOwner {
        selfdestruct(msg.sender);
    }


    ///// ############     MODIFIERS     ########## ///////

    modifier validState(uint _state){
        require(state == _state, "The current Delivery Note is not the valid state.");
        _;
    }

    modifier onlyReceiver(){
        require(msg.sender == receiver, "Only the originally defined receiver can accept a Delivery Note.");
        _;
    }
}