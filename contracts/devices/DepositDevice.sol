pragma solidity ^0.4.25;

import "contracts/DAOInterface.sol";
import "contracts/tokens/EIP20Interface.sol";
import "contracts/devices/DeliveryNoteInterface.sol";
import "contracts/devices/DeviceFactoryInterface.sol";
import "contracts/proofs/ProofsHandler.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Ereuse Device basic implementation
 */

contract DepositDevice is Ownable {
    // parameters -----------------------------------------------------------
    EIP20Interface erc20;
    DAOInterface public DAOContract;
    DeviceFactoryInterface factory;
    ProofsHandler handler;
    mapping(string => bytes32[]) proofs;
    string[] private types;

    // types ----------------------------------------------------------------
    //Struct that mantains the basic values of the device
    struct DevData {
        uint256 uid;
        uint256 erc721Id;
        uint256 deposit;
        address owner;
        uint256 state;
        uint256 deviceUsage;
    }

    // variables -------------------------------------------------------------
    DevData data;

    // events ----------------------------------------------------------------
    event proofGenerated(bytes32 indexed proofHash);

    constructor(
        uint256 _uid,
        address _sender,
        uint256 _initialDeposit,
        address _daoAddress
    ) public {
        DAOContract = DAOInterface(_daoAddress);
        address erc20Address = DAOContract.getERC20();
        address dFactory = DAOContract.getDeviceFactory();
        address pHandler = DAOContract.getProofsHandler();
        erc20 = EIP20Interface(erc20Address);
        factory = DeviceFactoryInterface(dFactory);
        handler = ProofsHandler(pHandler);
        data.owner = _sender;
        data.deposit = _initialDeposit;
        data.uid = _uid;
        data.deviceUsage = 0;
        _transferOwnership(_sender);
        types = [
            "ProofDataWipe",
            "ProofFunction",
            "ProofTransfer",
            "ProofReuse",
            "ProofRecycling"
        ];
    }

    function transferDevice(address _to, uint256 _new_deposit)
        public
        onlyOwner
    {
        // Return the deposit first of all
        returnDeposit();

        factory.transfer(data.owner, _to);
        data.owner = _to;
        data.deposit = _new_deposit;
        transferOwnership(_to);
    }

    function updateDeviceUsage(uint256 diskUsage) private {
        data.deviceUsage = data.deviceUsage + diskUsage;
    }

    function getProofs(string proofType)
        public
        view
        returns (bytes32[] hashes)
    {
        return proofs[proofType];
    }

    function getProof(bytes32 _hash, string proofType)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return handler.getProof(_hash, proofType);
    }

    function hasProofs(string proofType) public view returns (bool _result) {
        return proofs[proofType].length > 0;
    }

    function isRecycled() public view returns (bytes32 _result) {
        if (hasProofs("ProofRecycling")) {
            return proofs["ProofRecycling"][0];
        } else {
            return "";
        }
    }

    function generateFunctionProof(
        uint256 score,
        uint256 diskUsage,
        string algorithmVersion,
        address proofAuthor,
        string diskSN
    ) public {
        bytes32 proofHash = handler.generateFunctionProof(
            address(this),
            this.owner(),
            score,
            diskUsage,
            algorithmVersion,
            proofAuthor,
            diskSN
        );
        proofs["ProofFunction"].push(proofHash);
        emit proofGenerated(proofHash);
        updateDeviceUsage(diskUsage);
    }

    function getFunctionProof(bytes32 _hash)
        public
        view
        returns (
            uint256 score,
            uint256 diskUsage,
            string algorithmVersion,
            address proofAuthor,
            string diskSN
        )
    {
        return handler.getFunctionProofData(_hash);
    }

    function generateTransferProof(
        address supplier,
        address receiver,
        uint256 deposit,
        bool isWaste
    ) public {
        bytes32 proofHash = handler.generateTransferProof(
            address(this),
            this.owner(),
            supplier,
            receiver,
            deposit,
            isWaste
        );
        proofs["ProofTransfer"].push(proofHash);
        emit proofGenerated(proofHash);
    }

    function getTransferProof(bytes32 _hash)
        public
        view
        returns (
            address supplier,
            address receiver,
            uint256 deposit,
            bool isWaste
        )
    {
        return handler.getTransferProofData(_hash);
    }

    function generateDataWipeProof(
        string erasureType,
        string date,
        bool erasureResult,
        address proofAuthor,
        string diskSN
    ) public {
        bytes32 proofHash = handler.generateDataWipeProof(
            address(this),
            this.owner(),
            erasureType,
            date,
            erasureResult,
            proofAuthor,
            diskSN
        );
        proofs["ProofDataWipe"].push(proofHash);
        emit proofGenerated(proofHash);
    }

    function getDataWipeProof(bytes32 _hash)
        public
        view
        returns (
            string erasureType,
            string date,
            bool erasureResult,
            address proofAuthor,
            string diskSN
        )
    {
        return handler.getDataWipeProofData(_hash);
    }

    function generateReuseProof(
        string receiverSegment,
        string idReceipt,
        uint256 price
    ) public {
        bytes32 proofHash = handler.generateReuseProof(
            address(this),
            this.owner(),
            receiverSegment,
            idReceipt,
            price
        );
        proofs["ProofReuse"].push(proofHash);
        emit proofGenerated(proofHash);
    }

    function getReuseProof(bytes32 _hash)
        public
        view
        returns (string receiverSegment, string idReceipt, uint256 price)
    {
        return handler.getReuseProofData(_hash);
    }

    function generateRecycleProof(
        string collectionPoint,
        string date,
        string contact,
        string ticket,
        string gpsLocation,
        string recyclerCode
    ) public {
        bytes32 proofHash = handler.generateRecycleProof(
            address(this),
            this.owner(),
            collectionPoint,
            date,
            contact,
            ticket,
            gpsLocation,
            recyclerCode
        );
        proofs["ProofRecycling"].push(proofHash);
        emit proofGenerated(proofHash);
    }

    function getRecycleProof(bytes32 _hash)
        public
        view
        returns (
            string collectionPoint,
            string date,
            string contact,
            string ticket,
            string gpsLocation,
            string recyclerCode
        )
    {
        return handler.getRecycleProofData(_hash);
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

    function getOwner() public view returns (address owner) {
        return data.owner;
    }

    function getDeposit() public view returns (uint256 deposit) {
        return data.deposit;
    }

    function getUid() public view returns (uint256 uid) {
        return data.uid;
    }

    function getDeviceUsage() public view returns (uint256 uid) {
        return data.deviceUsage;
    }

    function recycle(address _owner) public {
        require(
            this.owner() == msg.sender,
            "Only owner can recycle the device."
        );
        returnDeposit();
        factory.recycle(_owner);
    }
}
