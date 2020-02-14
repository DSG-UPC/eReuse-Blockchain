pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";

contract RecycleProofs is GenericProof {
    struct ProofData {
        string collectionPoint;
        string date;
        string contact;
    }
    mapping(bytes32 => ProofData) dataProofs;

    constructor() public GenericProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (string _collectionPoint, string _date, string _contact)
    {
        return (
            dataProofs[_hash].collectionPoint,
            dataProofs[_hash].date,
            dataProofs[_hash].contact
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        string collectionPoint,
        string date,
        string contact
    ) public returns (bytes32 _hash_) {
        bytes32 _hash = generateHash(device_addr);
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(collectionPoint, date, contact);
        return _hash;
    }

}
