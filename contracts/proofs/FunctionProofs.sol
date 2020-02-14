pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract FunctionProofs is GenericProof {
    struct ProofData {
        uint256 score;
        uint256 diskUsage;
    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (uint256 _score, uint256 _diskUsage)
    {
        return (dataProofs[_hash].score, dataProofs[_hash].diskUsage);
    }

    function setProofData(
        address device_addr,
        address owner,
        uint256 score,
        uint256 diskUsage
    ) public returns (bytes32 _hash_) {
        bytes32 _hash = generateHash(device_addr);
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(score, diskUsage);
        return _hash;
    }

}
