pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract TransferProofs is GenericProof {
    struct ProofData {
        address supplier;
        address receiver;
        uint256 deposit;
        bool isWaste;
    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (
            address supplier,
            address receiver,
            uint256 deposit,
            bool isWaste
        )
    {
        return (
            dataProofs[_hash].supplier,
            dataProofs[_hash].receiver,
            dataProofs[_hash].deposit,
            dataProofs[_hash].isWaste
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        address supplier,
        address receiver,
        uint256 deposit,
        bool isWaste
    ) public returns (bytes32 _hash) {
        _hash = generateHash(device_addr, "transfer");
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(supplier, receiver, deposit, isWaste);
        return _hash;
    }
}
