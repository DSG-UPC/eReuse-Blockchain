pragma solidity ^0.4.25;
import "contracts/proofs/DataWipeProofs.sol";
import "contracts/proofs/FunctionProofs.sol";
import "contracts/proofs/TransferProofs.sol";
import "contracts/proofs/RecycleProofs.sol";
import "contracts/proofs/ReuseProofs.sol";


contract ProofsHandler {
    DataWipeProofs private dataWipeProofs;
    FunctionProofs private functionProofs;
    TransferProofs private transferProofs;
    RecycleProofs private recycleProofs;
    ReuseProofs private reuseProofs;

    constructor() public {}

    // -------------- SETTERS FOR PROOFS --------------- //

    function setDataWipeProofs(address proofs) public {
        dataWipeProofs = DataWipeProofs(proofs);
    }

    function setFunctionProofs(address proofs) public {
        functionProofs = FunctionProofs(proofs);
    }

    function setTransferProofs(address proofs) public {
        transferProofs = TransferProofs(proofs);
    }

    function setRecycleProofs(address proofs) public {
        recycleProofs = RecycleProofs(proofs);
    }

    function setReuseProofs(address proofs) public {
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

    function generateFunctionProof(
        address deviceAddress,
        address owner,
        uint256 score,
        uint256 diskUsage,
        string algorithmVersion,
        address proofAuthor,
        string diskSN,
        string deviceSN,
        string deviceModel,
        string deviceManufacturer
    ) public returns (bytes32 _hash) {
        bytes32 h = generateFunctionProof(
            deviceAddress,
            owner,
            score,
            diskUsage,
            algorithmVersion,
            proofAuthor
        );
        functionProofs.setMetricsInfo(
            h,
            diskSN,
            deviceSN,
            deviceModel,
            deviceManufacturer
        );
        return h;
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
        bool erasureResult,
        address proofAuthor
    ) public returns (bytes32 _hash) {
        return
            dataWipeProofs.setProofData(
                deviceAddress,
                owner,
                erasureType,
                erasureResult,
                proofAuthor
            );
    }

    function generateDataWipeProof(
        address deviceAddress,
        address owner,
        string erasureType,
        bool erasureResult,
        address proofAuthor,
        string diskSN,
        string deviceSN,
        string deviceModel,
        string deviceManufacturer
    ) public returns (bytes32 _hash) {
        bytes32 h = generateDataWipeProof(
            deviceAddress,
            owner,
            erasureType,
            erasureResult,
            proofAuthor
        );
        dataWipeProofs.setMetricsInfo(
            h,
            diskSN,
            deviceSN,
            deviceModel,
            deviceManufacturer
        );
        return h;
    }

    function generateReuseProof(
        address deviceAddress,
        address owner,
        string receiverSegment,
        string idReceipt,
        uint256 price
    ) public returns (bytes32 _hash) {
        return
            reuseProofs.setProofData(
                deviceAddress,
                owner,
                receiverSegment,
                idReceipt,
                price
            );
    }

    function generateRecycleProof(
        address deviceAddress,
        address owner,
        string collectionPoint,
        string contact,
        string ticket,
        string gpsLocation,
        string recyclerCode
    ) public returns (bytes32 _hash) {
        return
            recycleProofs.setProofData(
                deviceAddress,
                owner,
                collectionPoint,
                contact,
                ticket,
                gpsLocation,
                recyclerCode
            );
    }

    function compareProofTypes(string original, string expected)
        private
        pure
        returns (bool result)
    {
        return
            keccak256(abi.encodePacked(original)) ==
            keccak256(abi.encodePacked(expected));
    }

    // -------------- GETTERS FOR PROOFS --------------- //

    function getProof(bytes32 _hash, string proofType)
        public
        view
        returns (
            uint256 block_number,
            address device_id,
            address owner,
            uint256 timestamp
        )
    {
        if (compareProofTypes(proofType, "ProofFunction")) {
            return getFunctionProof(_hash);
        } else if (compareProofTypes(proofType, "ProofDataWipe")) {
            return getDataWipeProof(_hash);
        } else if (compareProofTypes(proofType, "ProofTransfer")) {
            return getTransferProof(_hash);
        } else if (compareProofTypes(proofType, "ProofRecycling")) {
            return getRecycleProof(_hash);
        } else {
            return getReuseProof(_hash);
        }
    }

    function getMetricsProof(bytes32 _hash, string proofType)
        public
        view
        returns (
            string diskSN,
            string deviceSN,
            string deviceModel,
            string deviceManufacturer,
            uint timestamp
        )
    {
        if (compareProofTypes(proofType, "ProofFunction"))
            return functionProofs.getMetricsInfo(_hash);
        else if (compareProofTypes(proofType, "ProofDataWipe"))
            return dataWipeProofs.getMetricsInfo(_hash);
    }

    function getFunctionProof(bytes32 _hash)
        public
        view
        returns (
            uint256 block_number,
            address device_id,
            address owner,
            uint256 timestamp
        )
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
        returns (
            uint256 block_number,
            address device_id,
            address owner,
            uint256 timestamp
        )
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
        returns (
            uint256 block_number,
            address device_id,
            address owner,
            uint256 timestamp
        )
    {
        return dataWipeProofs.getProof(_hash);
    }

    function getDataWipeProofData(bytes32 _hash)
        public
        view
        returns (string erasureType, bool erasureResult, address proofAuthor)
    {
        return dataWipeProofs.getProofData(_hash);
    }

    function getRecycleProof(bytes32 _hash)
        public
        view
        returns (
            uint256 block_number,
            address device_id,
            address owner,
            uint256 timestamp
        )
    {
        return recycleProofs.getProof(_hash);
    }

    function getRecycleProofData(bytes32 _hash)
        public
        view
        returns (
            string collectionPoint,
            string contact,
            string ticket,
            string gpsLocation,
            string recyclerCode
        )
    {
        return recycleProofs.getProofData(_hash);
    }

    function getReuseProof(bytes32 _hash)
        public
        view
        returns (
            uint256 block_number,
            address device_id,
            address owner,
            uint256 timestamp
        )
    {
        return reuseProofs.getProof(_hash);
    }

    function getReuseProofData(bytes32 _hash)
        public
        view
        returns (string receiverSegment, string idReceipt, uint256 price)
    {
        return reuseProofs.getProofData(_hash);
    }
}
