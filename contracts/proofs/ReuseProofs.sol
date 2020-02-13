pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract ReuseProofs is GenericProof{
    struct ProofData {
        
    }

    mapping(uint => ProofData) dataProofs;

    constructor() public GenericProof() {
        
    }

    function getProofData(uint _hash) public view {

    }

    function setProofData(uint _hash, address device_addr, address owner) public{
        setProof(_hash, device_addr, owner);
    }

}
