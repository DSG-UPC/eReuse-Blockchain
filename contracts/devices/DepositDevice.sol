pragma solidity ^0.4.25;

import "contracts/tokens/MyERC721.sol";
import "contracts/tokens/EIP20Interface.sol";
import "contracts/helpers/RoleManager.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "contracts/DAOInterface.sol";
import "contracts/devices/DeliveryNoteInterface.sol";
import "contracts/devices/DeviceFactoryInterface.sol";


/**
 * @title Ereuse Device basic implementation
 */

contract DepositDevice is Ownable{
    // parameters ----------------------------------------------------------------
    RoleManager roleManager;
    MyERC721 erc721;
    EIP20Interface erc20;
    DAOInterface public DAOContract;
    DeviceFactoryInterface factory;

    // types ----------------------------------------------------------------
    //Struct that mantains the basic values of the device
    struct DevData {
        string name;
        uint256 uid;
        uint256 erc721Id;
        uint deposit;
        address owner;
        uint state;
    }

    // variables ----------------------------------------------------------------
    DevData data;


    // events ----------------------------------------------------------------
    event TestEv(address test);


    constructor(string _name, address _sender, uint _initialDeposit, address _daoAddress)
    public
    {
        DAOContract = DAOInterface(_daoAddress);
        address erc20Address = DAOContract.getERC20();
        address erc721Address = DAOContract.getERC721();
        address roleManagerAddress = DAOContract.getRoleManager();
        address d_factory = DAOContract.getDeviceFactory();
        roleManager = RoleManager(roleManagerAddress);
        erc721 = MyERC721(erc721Address);
        erc20 = EIP20Interface(erc20Address);
        factory = DeviceFactoryInterface(d_factory);
        data.name = _name;
        data.owner = _sender;
        data.deposit = _initialDeposit;
        _transferOwnership(_sender);
    }

    function transferDevice(address _to, uint _new_deposit)
    public
    onlyOwner
    {
        // Return the deposit first of all
        returnDeposit();

        data.owner = _to;
        data.deposit = _new_deposit;
        factory.transfer(data.owner);
        transferOwnership(_to);
    }

    function returnDeposit() public{
        erc20.transfer(data.owner, data.deposit);
    }

    function addToDeliveryNote(address _deliveryNote)
    public
    onlyOwner
    {
        DeliveryNoteInterface devNote = DeliveryNoteInterface(_deliveryNote);
        devNote.addDevice(address(this), this.owner(), data.deposit);

        data.owner = _deliveryNote;
        transferOwnership(_deliveryNote);
    }

    function getOwner() public view returns(address) {
        return data.owner;
    }

    function getName() public view returns(string) {
        return data.name;
    }

    function getDeposit() public view returns(uint256) {
        return data.deposit;
    }

    function mint(address _to)
    public
    onlyOwner
    {
        require(roleManager.isConsumer(_to), "The destination is not a consumer");
        erc20.transferFrom(msg.sender, address(this), data.deposit);
        erc721.mint(_to, uint256(address(this)));
        data.uid = uint256(address(this));
        _transferOwnership(msg.sender);
    }

    function toRepair(address _to, uint benefit)
    public
    onlyItad
    {
        require(roleManager.isRepairer(_to), "The destination is not a repairer");
        _transfer(msg.sender, _to, benefit);
    }

    function toItad(address _to, uint benefit)
    public
    {
        require(roleManager.isItad(_to),  "The destination is not an itad");
        _transfer(msg.sender, _to, benefit);
    }

    function toRecycle(address _to, uint benefit)
    public
    {
        require(roleManager.isProcessor(_to), "The destination is not a a processor");
        _transfer(msg.sender, _to, benefit);
    }

    function recycle()
    public
    onlyItad
    {
        erc20.transferFrom(address(this), msg.sender, address(this).balance);
        erc721.burn(msg.sender, data.uid);
    }

    // internals ----------------------------------------------------------------

    function _transfer(address _from, address _to, uint valueSent)
    private
    onlyOwner
    {
        require(_to != address(0), "The destination cannot be the 0 address");
        erc721.transferFrom(_from, _to, data.uid);
        erc20.transferFrom(_from, _to, valueSent);
        _transferOwnership(_to);
        data.owner = _to;
    }

    // modifiers ----------------------------------------------------------------

    modifier onlyProducer{
        require(roleManager.isProducer(msg.sender), "This request was not originated by a Producer");
        _;
    }

    modifier onlyConsumer{
        require(roleManager.isConsumer(msg.sender), "This request was not originated by a Consumer");
        _;
    }

    modifier onlyProcessor{
        require(roleManager.isProcessor(msg.sender), "This request was not originated by a Processor");
        _;
    }

    modifier onlyRepairer() {
        require(roleManager.isRepairer(msg.sender), "This request was not originated by a Repairer");
        _;
    }

    modifier onlyItad() {
        require(roleManager.isItad(msg.sender), "This request was not originated by a Repairer");
        _;
    }
}