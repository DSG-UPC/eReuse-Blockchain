pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract DataWipeProofs is GenericProof {
    struct ProofData {
        string erasureType;
        string date;
        bool erasureResult;
        address proofAuthor;
    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (
            string erasureType,
            string date,
            bool erasureResult,
            address proofAuthor
        )
    {
        return (
            dataProofs[_hash].erasureType,
            dataProofs[_hash].date,
            dataProofs[_hash].erasureResult,
            dataProofs[_hash].proofAuthor
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        string erasureType,
        string date,
        bool erasureResult,
        address proofAuthor
    ) public returns (bytes32 _hash) {
        _hash = generateHash(device_addr, "ProofDataWipe");
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(
            erasureType,
            date,
            erasureResult,
            proofAuthor
        );
        return _hash;
    }
}
