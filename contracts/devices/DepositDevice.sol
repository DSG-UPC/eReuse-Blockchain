pragma solidity ^0.4.25;

import "../tokens/MyERC721.sol";
import "contracts/tokens/EIP20Interface.sol";
import "contracts/helpers/RoleManager.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "contracts/DAOInterface.sol";


/**
 * @title Ereuse Device basic implementation
 */

contract Offchainsig {

    mapping(address=>uint256) internal nonces;

    function nonceOf(address _owner)
    public view returns (uint256) {
        return nonces[_owner];
    }

    function _verify(
        address _from,bytes memory _message,
        bytes32 _r,bytes32 _s,uint8 _v
    ) internal {
        bytes32 hash = keccak256(abi.encodePacked(
            byte(0x19),byte(0),
            this,nonces[_from],
            _message
        ));

        address from = ecrecover(hash,_v,_r,_s);
        require(from==_from,"sender-address-does-not-match");
        nonces[_from]++;
    }

}


contract DepositDevice is Ownable, Offchainsig {
    // parameters ----------------------------------------------------------------
    RoleManager roleManager;
    MyERC721 erc721;
    EIP20Interface erc20;
    DAOInterface public DAOContract;

    // types ----------------------------------------------------------------
    //Struct that mantains the basic values of the device
    struct DevData {
        string name;
        uint256 uid;
        uint256 erc721Id;
        uint value;
        address owner;
        uint state;
    }

    // variables ----------------------------------------------------------------
    DevData data;

    constructor(string _name, address _sender, uint _initialDeposit, uint _daoAddress)
    public
    {
        //daoAddress = _daoAddress;
        DAOContract = DAOInterface(_daoAddress);
        address erc20Address = DAOContract.getERC20();
        address erc721Address = DAOContract.getERC721();
        address roleManagerAddress = DAOContract.getRoleManager();
        roleManager = RoleManager(roleManagerAddress);
        require(roleManager.isNotary(msg.sender), "This device contract was not created by a Notary");
        erc721 = MyERC721(erc721Address);
        erc20 = EIP20Interface(erc20Address);
        data.name = _name;
        data.owner = _sender;
        data.value = _initialDeposit;
        transferOwnership(_sender);
    }

    function mint(
        address _to,
        bytes32 _r, bytes32 _s, uint8 _v)
    external
    onlyOwner
    {
        _verify(msg.sender,abi.encodePacked(_to),_r,_s,_v);
        require(roleManager.isRepairer(_to), "The destination is not a consumer");
        erc20.transferFrom(msg.sender, address(this), data.value);
        erc721.mint(_to, uint256(address(this)));
        data.uid = uint256(address(this));
        transferOwnership(msg.sender);
    }

    function toRepair(
        address _to, uint benefit,
        bytes32 _r, bytes32 _s, uint8 _v)
    external
    onlyItad
    {
        _verify(msg.sender,abi.encodePacked(_to, benefit),_r,_s,_v);
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
        require(roleManager.isProcessor(_to), "The destination is not a a recycler");
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
        transferOwnership(_to);
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