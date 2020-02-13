pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract ReuseProofs is GenericProof {
    struct ProofData {

    }

    mapping(uint256 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(uint256 _hash) public view {}

    function setProofData(address device_addr, address owner) public {
        uint256 _hash = generateHash();
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData();
    }

}
