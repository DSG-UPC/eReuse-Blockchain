pragma solidity ^0.4.25;

import "../tokens/MyERC721.sol";
import "contracts/tokens/EIP20Interface.sol";
import "contracts/helpers/RoleManager.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Ereuse Device basic implementation
 */
contract DepositDevice is Ownable{
    RoleManager roleManager;
    MyERC721 erc721;
    EIP20Interface erc20;

    // Struct that mantains the basic values of the device
    struct DevData {
        string name;
        uint256 uid;
        uint256 erc721Id;
        uint value;
        address owner;
        uint state;
    }
    DevData data;

    constructor (string _name, address _sender, uint _initialDeposit,  address _erc20,  address _erc721, address _roleManager ) 
    public
    {        
        roleManager = RoleManager(_roleManager);
        erc721  = MyERC721(_erc721); 
        erc20 = EIP20Interface(_erc20);
        data.name = _name;
        data.owner = _sender;
        data.uid = address(this);
        data.value = _initialDeposit;
        transferOwnership(_sender);
    }

    function mint(address _to) 
    onlyOwner 
    public 
    {
        require(roleManager.isRepairer(_to), "The destination is not a consumer");
        erc20.transferFrom(msg.sender, address(this), data.value);
        erc721.mint(_to, address(this));
    }

    function _transfer(address _from, address _to, uint valueSent) 
    onlyOwner 
    private {
        require(_to != address(0), "The destination cannot be the 0 address");
        erc721.transferFrom( _from, _to, address(this));
        erc20.transferFrom( _from, _to, valueSent);
        transferOwnership(_to);
        data.owner = _to;
    }

    function toRepair(uint256 uid, address _to, uint benefit)
    onlyItad
    public
    {
        require(roleManager.isRepairer(_to), "The destination is not a repairer");
        _transfer(msg.sender, _to, benefit);
    }

    function toItad(uint256 uid, address _to, uint benefit)
    public
    {
        require(roleManager.isItad(_to),  "The destination is not an itad");
        _transfer(msg.sender, _to, benefit);
    }

    function toRecycle(uint256 uid, address _to, uint benefit)
    public
    {
        require(roleManager.isProcessor(_to), "The destination is not a a recycler");
        _transfer(msg.sender, _to, benefit);
    }

    function recycle(uint256 uid)
    public
    onlyItad
    {
       
        erc20.transferFrom(address(this), msg.sender, address(this).balance);
        erc721.burn(address(this));
    }


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