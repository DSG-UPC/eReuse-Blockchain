pragma solidity ^0.4.25;

import "contracts/helpers/roles/ConsumerRole.sol";
import "contracts/helpers/roles/ProducerRole.sol";
import "contracts/helpers/roles/RecyclerRole.sol";

contract RoleManager {

    ProducerRole private producers;
    RecyclerRole private recyclers;
    ConsumerRole private consumers;

    function getConsumers() public view returns (ConsumerRole addr){
        return consumers;
    }

    function getRecyclers() public view returns (RecyclerRole addr){
        return recyclers;
    }

    function getProducers() public view returns (ProducerRole addr){
        return producers;
    }

    constructor() public {
        consumers = new ConsumerRole();
        producers = new ProducerRole();
        recyclers = new RecyclerRole();
    }

    function isRecycler(address owner)
    view public
    returns(bool isIndeed){
        return recyclers.isRecycler(owner);
    }

    function isProducer(address owner)
    view public
    returns(bool isIndeed){
        return producers.isProducer(owner);
    }

    function isConsumer(address owner)
    view public
    returns(bool isIndeed){
        return consumers.isConsumer(owner);
    }

}