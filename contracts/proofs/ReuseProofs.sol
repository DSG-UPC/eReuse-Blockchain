pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract ReuseProofs is GenericProof {
    struct ProofData {
        string receiverSegment;
        string idReceipt;
        address supplier;
        address receiver;
        uint256 price;
    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (
            string receiverSegment,
            string idReceipt,
            address supplier,
            address receiver,
            uint256 price
        )
    {
        return (
            dataProofs[_hash].receiverSegment,
            dataProofs[_hash].idReceipt,
            dataProofs[_hash].supplier,
            dataProofs[_hash].receiver,
            dataProofs[_hash].price
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        string receiverSegment,
        string idReceipt,
        address supplier,
        address receiver,
        uint256 price
    ) public returns (bytes32 _hash) {
        _hash = generateHash(device_addr, "reuse");
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(
            receiverSegment,
            idReceipt,
            supplier,
            receiver,
            price
        );
        return _hash;
    }

}
