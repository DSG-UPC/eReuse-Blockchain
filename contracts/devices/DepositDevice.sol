pragma solidity ^0.4.25;

import "contracts/DAOInterface.sol";
import "contracts/tokens/MyERC721.sol";
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
    MyERC721 erc721;
    EIP20Interface erc20;
    DAOInterface public DAOContract;
    DeviceFactoryInterface factory;
    ProofsHandler handler;
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

    // variables -------------------------------------------------------------
    DevData data;

    // events ----------------------------------------------------------------
    event TestEv(address test);
    event proofGenerated(bytes32 proofHash);

    constructor(
        string _name,
        address _sender,
        uint256 _initialDeposit,
        address _daoAddress
    ) public {
        DAOContract = DAOInterface(_daoAddress);
        address erc20Address = DAOContract.getERC20();
        address erc721Address = DAOContract.getERC721();
        address dFactory = DAOContract.getDeviceFactory();
        address pHandler = DAOContract.getProofsHandler();
        erc721 = MyERC721(erc721Address);
        erc20 = EIP20Interface(erc20Address);
        factory = DeviceFactoryInterface(dFactory);
        handler = ProofsHandler(pHandler);
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

    function generateFunctionProof(
        uint256 score,
        uint256 diskUsage,
        string algorithmVersion,
        address proofAuthor
    ) public{
        bytes32 proofHash = handler.generateFunctionProof(
            address(this),
            this.owner(),
            score,
            diskUsage,
            algorithmVersion,
            proofAuthor
        );
        proofs["function"].push(proofHash);
        emit proofGenerated(proofHash);
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
        proofs["transfer"].push(proofHash);
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
        proofs["wipe"].push(proofHash);
        emit proofGenerated(proofHash);
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
        address supplier,
        address receiver,
        uint256 price
    ) public {
        bytes32 proofHash = handler.generateReuseProof(
            address(this),
            this.owner(),
            receiverSegment,
            idReceipt,
            supplier,
            receiver,
            price
        );
        proofs["reuse"].push(proofHash);
        emit proofGenerated(proofHash);
    }

    function getReuseProof(bytes32 _hash)
        public
        view
        returns (
            string receiverSegment,
            string idReceipt,
            address supplier,
            address receiver,
            uint256 price
        )
    {
        return handler.getReuseProofData(_hash);
    }

    function generateRecycleProof(
        string collectionPoint,
        string date,
        string contact,
        string ticket,
        string gpsLocation
    ) public {
        bytes32 proofHash = handler.generateRecycleProof(
            address(this),
            this.owner(),
            collectionPoint,
            date,
            contact,
            ticket,
            gpsLocation
        );
        proofs["recycle"].push(proofHash);
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
            string gpsLocation
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

    function getName() public view returns (string name) {
        return data.name;
    }

    function getDeposit() public view returns (uint256 deposit) {
        return data.deposit;
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
