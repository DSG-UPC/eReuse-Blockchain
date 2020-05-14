pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract DataWipeProofs is GenericProof {
    struct ProofData {
        string erasureType;
        string date;
        bool erasureResult;
        address proofAuthor;
        string diskSN;
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
            address proofAuthor,
            string diskSN
        )
    {
        return (
            dataProofs[_hash].erasureType,
            dataProofs[_hash].date,
            dataProofs[_hash].erasureResult,
            dataProofs[_hash].proofAuthor,
            dataProofs[_hash].diskSN
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        string erasureType,
        string date,
        bool erasureResult,
        address proofAuthor,
        string diskSN
    ) public returns (bytes32 _hash) {
        _hash = generateHash(device_addr, "ProofDataWipe");
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(
            erasureType,
            date,
            erasureResult,
            proofAuthor,
            diskSN
        );
        return _hash;
    }
}
