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
        string uid;
        uint256 erc721Id;
        uint256 deposit;
        address owner;
        uint256 state;
        string registrantData;
    }

    // variables -------------------------------------------------------------
    DevData data;

    // events ----------------------------------------------------------------
    event functionProof(address userAddress, address deviceAddress, uint256 score, uint256 diskUsage, string algorithmVersion);
    event proofGenerated(bytes32 indexed proofHash);
    event transferProof(address supplierAddress, address receiverAddress, address deviceAddress);
    event dataWipeProof(address userAddress, address deviceAddress, string erasureType, bool erasureResult);
    event reuseProof(address userAddress, address deviceAddress, string receiverSegment, string idReceipt, uint256 price);
    event recycleProof(address userAddress, address deviceAddress, string date);    
    event DeviceTransferred(address deviceAddress, address new_owner, string new_registrant);
    event DeviceRecycled(address deviceAddress);

    constructor(
        string _uid,
        address _sender,
        uint256 _initialDeposit,
        address _daoAddress,
        string _registrantData
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
        data.registrantData = _registrantData;
        _transferOwnership(_sender);
        types = [
            "ProofDataWipe",
            "ProofFunction",
            "ProofTransfer",
            "ProofReuse",
            "ProofRecycling"
        ];
    }

    function transferDevice(address _to, uint256 _new_deposit, string _new_registrant)
        public
        onlyOwner
    {
        // Return the deposit first of all
        returnDeposit();

        factory.transfer(data.owner, _to, data.registrantData, _new_registrant);
        data.owner = _to;
        data.registrantData = _new_registrant;
        data.deposit = _new_deposit;
        transferOwnership(_to);

        emit DeviceTransferred(address(this), data.owner, data.registrantData);
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

    function isRecycled() public view returns(bytes32 _result){
        if(hasProofs('ProofRecycling')){
            return proofs['ProofRecycling'][0];
        } else{
            return '';
        }
    }

    function generateFunctionProof(
        uint256 score,
        uint256 diskUsage,
        string algorithmVersion,
        address proofAuthor
    ) public {
        bytes32 proofHash = handler.generateFunctionProof(
            address(this),
            this.owner(),
            score,
            diskUsage,
            algorithmVersion,
            proofAuthor
        );
        proofs["ProofFunction"].push(proofHash);
        emit proofGenerated(proofHash);
        emit functionProof(this.owner(), address(this), score, diskUsage, algorithmVersion);
    }

    function getFunctionProof(bytes32 _hash)
        public
        view
        returns (
            uint256 score,
            uint256 diskUsage,
            string algorithmVersion,
            address proofAuthor
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
        emit transferProof(supplier, receiver, address(this));
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
        address proofAuthor
    ) public {
        bytes32 proofHash = handler.generateDataWipeProof(
            address(this),
            this.owner(),
            erasureType,
            date,
            erasureResult,
            proofAuthor
        );
        proofs["ProofDataWipe"].push(proofHash);
        emit proofGenerated(proofHash);
        emit dataWipeProof(proofAuthor, address(this), erasureType, erasureResult);
    }

    function getDataWipeProof(bytes32 _hash)
        public
        view
        returns (
            string erasureType,
            string date,
            bool erasureResult,
            address proofAuthor
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
        emit reuseProof(this.owner(), address(this), receiverSegment, idReceipt, price);
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
        emit recycleProof(this.owner(), address(this), date);    
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

    function getUid() public view returns (string uid) {
        return data.uid;
    }

    function recycle() public {
        require(
            this.owner() == msg.sender,
            "Only owner can recycle the device."
        );
        returnDeposit();
        factory.recycle(msg.sender, data.registrantData);
        emit DeviceRecycled(address(this));


    }
}