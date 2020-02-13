pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract DisposalProofs is GenericProof {
    struct ProofData {
        address origin;
        address destination;
        uint256 deposit;
    }

    mapping(uint256 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(uint256 _hash)
        public
        view
        returns (address _origin, address _destination, uint256 deposit)
    {
        return (
            dataProofs[_hash].origin,
            dataProofs[_hash].destination,
            dataProofs[_hash].deposit
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        address origin,
        address destination,
        uint256 deposit
    ) public {
        uint256 _hash = generateHash();
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(origin, destination, deposit);
    }
}
