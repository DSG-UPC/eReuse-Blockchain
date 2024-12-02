pragma solidity ^0.4.25;

contract DAOInterface {
    address public ERC20;
    address public ERC721;
    address public Owners;
    address public ProofsHandler;
    address public OracleQuery;
    address public OracleResponse;

    function getReserveAccount() public view returns (address);

    function getOracleQueryAddress() public view returns (address);

    function getOracleResponseAddress() public view returns (address);

    function getERC20() public view returns (address);

    function getERC721() public view returns (address);

    function getOwners() public view returns (address);

    // function getRoleManager() public view returns (address);

    function getDeviceFactory() public view returns (address);

    function getProofsHandler() public view returns (address);
}
