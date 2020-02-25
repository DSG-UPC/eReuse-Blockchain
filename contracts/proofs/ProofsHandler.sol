pragma solidity ^0.4.25;
import "contracts/proofs/DataWipeProofs.sol";
import "contracts/proofs/FunctionProofs.sol";
import "contracts/proofs/DisposalProofs.sol";
import "contracts/proofs/RecycleProofs.sol";
import "contracts/proofs/ReuseProofs.sol";

contract ProofsHandler {
    DataWipeProofs private dataWipeProofs;
    FunctionProofs private functionProofs;
    DisposalProofs private disposalProofs;
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

    function setDisposalProofs(address proofs) public {
        disposalProofs = DisposalProofs(proofs);
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
        string algorithmVersion
    ) public returns (bytes32 hash) {
        return
            functionProofs.setProofData(
                deviceAddress,
                owner,
                score,
                diskUsage,
                algorithmVersion
            );
    }

    function generateDisposalProof(
        address deviceAddress,
        address owner,
        address origin,
        address destination,
        uint256 deposit,
        bool residual
    ) public returns (bytes32 _hash) {
        return
            disposalProofs.setProofData(
                deviceAddress,
                owner,
                origin,
                destination,
                deposit,
                residual
            );
    }

    function generateDataWipeProof(
        address deviceAddress,
        address owner,
        string erasureType,
        string date,
        bool erasureResult
    ) public returns (bytes32 _hash) {
        return
            dataWipeProofs.setProofData(
                deviceAddress,
                owner,
                erasureType,
                date,
                erasureResult
            );
    }

    function generateReuseProof(
        address deviceAddress,
        address owner,
        uint256 price
    ) public returns (bytes32 _hash) {
        return reuseProofs.setProofData(deviceAddress, owner, price);
    }

    function getReuseProof(bytes32 _hash) public view returns (uint256 _price) {
        return reuseProofs.getProofData(_hash);
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

    function getFunctionProof(bytes32 _hash)
        public
        view
        returns (uint256 _score, uint256 _diskUsage, string _algorithmVersion)
    {
        return functionProofs.getProofData(_hash);
    }

    function getDisposalProof(bytes32 _hash)
        public
        view
        returns (
            address _origin,
            address _destination,
            uint256 _deposit,
            bool _residual
        )
    {
        return disposalProofs.getProofData(_hash);
    }

    function getDataWipeProof(bytes32 _hash)
        public
        view
        returns (string _erasureType, string _date, bool _erasureResult)
    {
        return dataWipeProofs.getProofData(_hash);
    }

    function getRecycleProof(bytes32 _hash)
        public
        view
        returns (
            string _collectionPoint,
            string _date,
            string _contact,
            string _ticket,
            string _gpsLocation
        )
    {
        return recycleProofs.getProofData(_hash);
    }
}
