pragma solidity ^0.4.25;
import "contracts/proofs/DataWipeProofs.sol";
import "contracts/proofs/FunctionProofs.sol";
import "contracts/proofs/TransferProofs.sol";
import "contracts/proofs/RecycleProofs.sol";
import "contracts/proofs/ReuseProofs.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ProofsHandler is Ownable {
    DataWipeProofs private dataWipeProofs;
    FunctionProofs private functionProofs;
    TransferProofs private transferProofs;
    RecycleProofs private recycleProofs;
    ReuseProofs private reuseProofs;

    constructor() public {}

    // -------------- SETTERS FOR PROOFS --------------- //

    function setDataWipeProofs(address proofs) public onlyOwner {
        dataWipeProofs = DataWipeProofs(proofs);
    }

    function setFunctionProofs(address proofs) public onlyOwner {
        functionProofs = FunctionProofs(proofs);
    }

    function setTransferProofs(address proofs) public onlyOwner {
        transferProofs = TransferProofs(proofs);
    }

    function setRecycleProofs(address proofs) public onlyOwner {
        recycleProofs = RecycleProofs(proofs);
    }

    function setReuseProofs(address proofs) public onlyOwner {
        reuseProofs = ReuseProofs(proofs);
    }

    // -------------- GENERATORS FOR PROOFS --------------- //

    function generateFunctionProof(
        address deviceAddress,
        address owner,
        uint256 score,
        uint256 diskUsage,
        string algorithmVersion,
        address proofAuthor
    ) public returns (bytes32 _hash) {
        return
            functionProofs.setProofData(
                deviceAddress,
                owner,
                score,
                diskUsage,
                algorithmVersion,
                proofAuthor
            );
    }

    function generateTransferProof(
        address deviceAddress,
        address owner,
        address supplier,
        address receiver,
        uint256 deposit,
        bool isWaste
    ) public returns (bytes32 _hash) {
        return
            transferProofs.setProofData(
                deviceAddress,
                owner,
                supplier,
                receiver,
                deposit,
                isWaste
            );
    }

    function generateDataWipeProof(
        address deviceAddress,
        address owner,
        string erasureType,
        string date,
        bool erasureResult,
        address proofAuthor
    ) public returns (bytes32 _hash) {
        return
            dataWipeProofs.setProofData(
                deviceAddress,
                owner,
                erasureType,
                date,
                erasureResult,
                proofAuthor
            );
    }

    function generateReuseProof(
        address deviceAddress,
        address owner,
        string receiverSegment,
        string idReceipt,
        address supplier,
        address receiver,
        uint256 price
    ) public returns (bytes32 _hash) {
        return
            reuseProofs.setProofData(
                deviceAddress,
                owner,
                receiverSegment,
                idReceipt,
                supplier,
                receiver,
                price
            );
    }

    function generateRecycleProof(
        address deviceAddress,
        address owner,
        string collectionPoint,
        string date,
        string contact,
        string ticket,
        string gpsLocation
    ) public returns (bytes32 _hash) {
        return
            recycleProofs.setProofData(
                deviceAddress,
                owner,
                collectionPoint,
                date,
                contact,
                ticket,
                gpsLocation
            );
    }

    // -------------- GETTERS FOR PROOFS --------------- //

    function getProof(bytes32 _hash, string proofType)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        if (
            keccak256(abi.encodePacked(proofType)) ==
            keccak256(abi.encodePacked("function"))
        ) {
            return getFunctionProof(_hash);
        } else if (
            keccak256(abi.encodePacked(proofType)) ==
            keccak256(abi.encodePacked("wipe"))
        ) {
            return getDataWipeProof(_hash);
        } else if (
            keccak256(abi.encodePacked(proofType)) ==
            keccak256(abi.encodePacked("transfer"))
        ) {
            return getTransferProof(_hash);
        } else if (
            keccak256(abi.encodePacked(proofType)) ==
            keccak256(abi.encodePacked("recycle"))
        ) {
            return getRecycleProof(_hash);
        } else {
            return getReuseProof(_hash);
        }
    }

    function getFunctionProof(bytes32 _hash)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return functionProofs.getProof(_hash);
    }

    function getFunctionProofData(bytes32 _hash)
        public
        view
        returns (
            uint256 score,
            uint256 diskUsage,
            string algorithmVersion,
            address proofAuthor
        )
    {
        return functionProofs.getProofData(_hash);
    }

    function getTransferProof(bytes32 _hash)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return transferProofs.getProof(_hash);
    }

    function getTransferProofData(bytes32 _hash)
        public
        view
        returns (
            address supplier,
            address receiver,
            uint256 deposit,
            bool isWaste
        )
    {
        return transferProofs.getProofData(_hash);
    }

    function getDataWipeProof(bytes32 _hash)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return dataWipeProofs.getProof(_hash);
    }

    function getDataWipeProofData(bytes32 _hash)
        public
        view
        returns (string erasureType, string date, bool erasureResult, address proofAuthor)
    {
        return dataWipeProofs.getProofData(_hash);
    }

    function getRecycleProof(bytes32 _hash)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return recycleProofs.getProof(_hash);
    }

    function getRecycleProofData(bytes32 _hash)
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
        return recycleProofs.getProofData(_hash);
    }

    function getReuseProof(bytes32 _hash)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return reuseProofs.getProof(_hash);
    }

    function getReuseProofData(bytes32 _hash)
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
        return reuseProofs.getProofData(_hash);
    }

}
