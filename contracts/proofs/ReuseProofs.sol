pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract ReuseProofs is GenericProof {
    struct ProofData {

    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash) public view {}

    function setProofData(address device_addr, address owner)
        public
        returns (bytes32 _hash_)
    {
        bytes32 _hash = generateHash(device_addr);
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData();
        return _hash;
    }

}
