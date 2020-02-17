pragma solidity ^0.4.25;

import "contracts/DAOInterface.sol";
import "contracts/tokens/MyERC721.sol";
import "contracts/tokens/EIP20Interface.sol";
import "contracts/helpers/RoleManager.sol";
import "contracts/devices/DeliveryNoteInterface.sol";
import "contracts/devices/DeviceFactoryInterface.sol";
import "contracts/proofs/DataWipeProofs.sol";
import "contracts/proofs/FunctionProofs.sol";
import "contracts/proofs/DisposalProofs.sol";
import "contracts/proofs/RecycleProofs.sol";
import "contracts/proofs/ReuseProofs.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Ereuse Device basic implementation
 */

contract DepositDevice is Ownable {
    // parameters ----------------------------------------------------------------
    RoleManager roleManager;
    MyERC721 erc721;
    EIP20Interface erc20;
    DAOInterface public DAOContract;
    DeviceFactoryInterface factory;
    mapping(string => bytes32[]) proofs;

    // types ----------------------------------------------------------------
    //Struct that mantains the basic values of the device
    struct DevData {
        string name;
        uint256 uid;
        uint256 erc721Id;
        uint256 deposit;
        address owner;
        uint256 state;
    }

    // variables ----------------------------------------------------------------
    DevData data;

    // events ----------------------------------------------------------------
    event TestEv(address test);

    constructor(
        string _name,
        address _sender,
        uint256 _initialDeposit,
        address _daoAddress
    ) public {
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

    function transferDevice(address _to, uint256 _new_deposit)
        public
        onlyOwner
    {
        // Return the deposit first of all
        returnDeposit();

        factory.transfer(_to);
        data.owner = _to;
        data.deposit = _new_deposit;
        transferOwnership(_to);
    }

    function generateFunctionProof(uint256 score, uint256 diskUsage) public {
        address proofAddress = DAOContract.getFunctionProofs();
        FunctionProofs proofsContract = FunctionProofs(proofAddress);
        bytes32 _hash = proofsContract.setProofData(
            address(this),
            this.owner(),
            score,
            diskUsage
        );
        proofs["function"].push(_hash);
    }

    function getProofs(string proofType)
        public
        view
        returns (bytes32[] _hashes)
    {
        return proofs[proofType];
    }

    function getFunctionProof(bytes32 _hash)
        public
        view
        returns (uint256 _score, uint256 _diskUsage)
    {
        address proofAddress = DAOContract.getFunctionProofs();
        FunctionProofs proofsContract = FunctionProofs(proofAddress);
        var (score, diskUsage) = proofsContract.getProofData(_hash);
        return (score, diskUsage);
    }

    function generateDisposalProof(
        address origin,
        address destination,
        uint256 deposit
    ) public {
        address proofAddress = DAOContract.getDisposalProofs();
        DisposalProofs proofsContract = DisposalProofs(proofAddress);
        bytes32 _hash = proofsContract.setProofData(
            address(this),
            this.owner(),
            origin,
            destination,
            deposit
        );
        proofs["disposal"].push(_hash);
    }

    function getDisposalProof(bytes32 _hash)
        public
        view
        returns (address _origin, address _destination, uint256 _deposit)
    {
        address proofAddress = DAOContract.getDisposalProofs();
        DisposalProofs proofsContract = DisposalProofs(proofAddress);
        var (origin, destination, deposit) = proofsContract.getProofData(_hash);
        return (origin, destination, deposit);
    }

    function generateDataWipeProof(
        string erasureType,
        string date,
        bool erasureResult
    ) public {
        address proofAddress = DAOContract.getDataWipeProofs();
        DataWipeProofs proofsContract = DataWipeProofs(proofAddress);
        bytes32 _hash = proofsContract.setProofData(
            address(this),
            this.owner(),
            erasureType,
            date,
            erasureResult
        );
        proofs["wipe"].push(_hash);
    }

    function getDataWipeProof(bytes32 _hash)
        public
        view
        returns (string _erasureType, string _date, bool _erasureResult)
    {
        address proofAddress = DAOContract.getDataWipeProofs();
        DataWipeProofs proofsContract = DataWipeProofs(proofAddress);
        var (erasureType, date, erasureResult) = proofsContract.getProofData(
            _hash
        );
        return (erasureType, date, erasureResult);
    }

    function generateReuseProof() public {
        address proofAddress = DAOContract.getReuseProofs();
        ReuseProofs proofsContract = ReuseProofs(proofAddress);
        bytes32 _hash = proofsContract.setProofData(
            address(this),
            this.owner()
        );
        proofs["reuse"].push(_hash);
    }

    function getReuseProof(bytes32 _hash) public view {
        address proofAddress = DAOContract.getReuseProofs();
        ReuseProofs proofsContract = ReuseProofs(proofAddress);
        proofsContract.getProofData(_hash);
    }

    function generateRecycleProof(
        string collectionPoint,
        string date,
        string contact
    ) public {
        address proofAddress = DAOContract.getRecycleProofs();
        RecycleProofs proofsContract = RecycleProofs(proofAddress);
        bytes32 _hash = proofsContract.setProofData(
            address(this),
            this.owner(),
            collectionPoint,
            date,
            contact
        );
        proofs["recycle"].push(_hash);
    }

    function getRecycleProof(bytes32 _hash)
        public
        view
        returns (string _collectionPoint, string _date, string _contact)
    {
        address proofAddress = DAOContract.getRecycleProofs();
        RecycleProofs proofsContract = RecycleProofs(proofAddress);
        var (collectionPoint, date, contact) = proofsContract.getProofData(
            _hash
        );
        return (collectionPoint, date, contact);
    }

    function returnDeposit() internal {
        if (data.deposit > 0) {
            erc20.transfer(data.owner, data.deposit);
            data.deposit = 0;
        }
    }

    function addToDeliveryNote(address _deliveryNote) public onlyOwner {
        DeliveryNoteInterface devNote = DeliveryNoteInterface(_deliveryNote);
        devNote.addDevice(address(this), this.owner(), data.deposit);
        transferOwnership(_deliveryNote);
    }

    function getOwner() public view returns (address) {
        return data.owner;
    }

    function getName() public view returns (string) {
        return data.name;
    }

    function getDeposit() public view returns (uint256) {
        return data.deposit;
    }

    function recycle(address _owner) public {
        require(
            this.owner() == msg.sender,
            "Only owner can recycle the device."
        );
        returnDeposit();
        factory.recycle(_owner);
        kill();
    }

    function kill() internal {
        selfdestruct(msg.sender);
    }
}
