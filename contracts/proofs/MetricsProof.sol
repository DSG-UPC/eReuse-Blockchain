pragma solidity ^0.4.25;
import "contracts/proofs/GenericProof.sol";


contract MetricsProof is GenericProof {
    struct MetricsData {
        string diskSN;
        string deviceSN;
        string deviceModel;
        string deviceManufacturer;
        string timestamp;
    }

    mapping(bytes32 => MetricsData) metricsData;

    constructor() public GenericProof() {}

    function getMetricsData(bytes32 _hash)
        public
        view
        returns (
            string diskSN,
            string deviceSN,
            string deviceModel,
            string deviceManufacturer,
            string timestamp
        )
    {
        return (
            metricsData[_hash].diskSN,
            metricsData[_hash].deviceSN,
            metricsData[_hash].deviceModel,
            metricsData[_hash].deviceManufacturer,
            metricsData[_hash].timestamp
        );
    }

    function setMetricsData(
        bytes32 _hash,
        string diskSN,
        string deviceSN,
        string deviceModel,
        string deviceManufacturer,
        string timestamp
    ) internal {
        metricsData[_hash] = MetricsData(
            diskSN,
            deviceSN,
            deviceModel,
            deviceManufacturer,
            timestamp
        );
    }
}
