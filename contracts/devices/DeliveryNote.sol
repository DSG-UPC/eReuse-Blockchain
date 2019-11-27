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
        num_devices = 0;
        state = 0;
        deposit = 0 ;
    }

    function addDevice(address _device, address _owner, uint256 _deposit)
    public
    {
        require(this.owner ==_owner, "Device that belong to onwers other that the DeliveryNote owner cannot be added");
        devices[num_devices] = _device;
        num_devices++;
        deposit = deposit+_deposit;
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
        require(msg.sender == receiver, "Only the originally defined receiver can accept a Delivery Note");
        erc20.transferFrom(msg.sender, address(this),deposit);
        transferDevices();

    }

    function tranferDevices()
    internal
    {
        // While calling the transferDevice()
        // while(num_providers > 0){
        //     current_device = devices[num_devices-1];
        //     delete devices[num_devices-1];
        //     num_devices--;
        // }
    }

    function transferDevice(address _device)
    internal
    {
        DepositDevice device = DepositDevice(_device);
        device.transferDevice();
    }
}

