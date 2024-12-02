pragma solidity ^0.4.25;

contract LifeCycleEvent {

event LifeCycleAction(
        uint256 indexed deviceId,
        string action,
        string contractName,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );

}