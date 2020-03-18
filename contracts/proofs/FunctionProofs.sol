pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract FunctionProofs is GenericProof {
    struct ProofData {
        uint256 score;
        uint256 diskUsage;
        string algorithmVersion;
        address proofAuthor;
    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (
            uint256 score,
            uint256 diskUsage,
            string algorithmVersion,
            address proofAuthor
        )
    {
        return (
            dataProofs[_hash].score,
            dataProofs[_hash].diskUsage,
            dataProofs[_hash].algorithmVersion,
            dataProofs[_hash].proofAuthor
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        uint256 score,
        uint256 diskUsage,
        string algorithmVersion,
        address proofAuthor
    ) public returns (bytes32 _hash) {
        _hash = generateHash(device_addr, "ProofFunction");
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(
            score,
            diskUsage,
            algorithmVersion,
            proofAuthor
        );
        return _hash;
    }

}
