pragma solidity ^0.4.25;

contract GenericProof {
    struct Proof {
        uint256 block_number;
        address device_id;
        address owner;
    }

    mapping(uint256 => Proof) proofs;

    constructor() public {}

    function generateHash() public view returns (uint256 _hash) {
        return 0;
    }

    function setProof(
        uint256 _hash,
        address device_addr,
        address owner
    ) internal {
        Proof memory p = Proof(block.number, device_addr, owner);
        proofs[_hash] = p;
    }

    function getProof(uint256 _hash)
        public
        view
        returns (uint256 block_number, address device_id, address owner)
    {
        return (
            proofs[_hash].block_number,
            proofs[_hash].device_id,
            proofs[_hash].owner
        );
    }
}
