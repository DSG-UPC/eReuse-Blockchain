pragma solidity ^0.4.25;
import "contracts/proofs/MetricsProof.sol";


contract DataWipeProofs is MetricsProof {
    struct ProofData {
        string erasureType;
        bool erasureResult;
        address proofAuthor;
    }

    mapping(bytes32 => ProofData) dataProofs;

    constructor() public MetricsProof() {}

    function getProofData(bytes32 _hash)
        public
        view
        returns (string erasureType, bool erasureResult, address proofAuthor)
    {
        return (
            dataProofs[_hash].erasureType,
            dataProofs[_hash].erasureResult,
            dataProofs[_hash].proofAuthor
        );
    }

    function getMetricsInfo(bytes32 _hash)
        public
        view
        returns (
            string diskSN,
            string deviceSN,
            string deviceModel,
            string deviceManufacturer,
            uint timestamp
        )
    {
        return getMetricsData(_hash);
    }

    function setMetricsInfo(
        bytes32 _hash,
        string diskSN,
        string deviceSN,
        string deviceModel,
        string deviceManufacturer
    ) public {
        setMetricsData(
            _hash,
            diskSN,
            deviceSN,
            deviceModel,
            deviceManufacturer
        );
    }

    function setProofData(
        address device_addr,
        address owner,
        string erasureType,
        bool erasureResult,
        address proofAuthor
    ) public returns (bytes32 _hash) {
        _hash = generateHash(device_addr, "ProofDataWipe");
        setProof(_hash, device_addr, owner);
        dataProofs[_hash] = ProofData(erasureType, erasureResult, proofAuthor);
        return _hash;
    }
}
