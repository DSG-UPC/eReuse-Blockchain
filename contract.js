const fs = require('fs');
const truffle = require('./truffle');


// assigning to exports will not modify module, must use module.exports
module.exports = class Contract {
  constructor(_name, _network) {
    this.name = _name;
    this.abi = _loadContractAbi(_name);
    this.address = _loadContractAddress(_name, String(_network));
    this.artifact = require('./build/contracts/'+_name+'.json');
    this.provider = _loadContractProvider(_network);
  }
};

function _loadContractAddress(_contract, _network) {
  let compiledContract = require('./build/contracts/'+_contract+'.json');
  const network_id = truffle.networks[_network].network_id;
  if (network_id in compiledContract.networks) {
    return compiledContract.networks[network_id].address;
  }else{
    console.log(_contract,' Not Deployed');
    return '';
  }
}

function _loadContractAbi(_contract) {
  let compiledContract = require('./build/contracts/'+_contract+'.json');
  return compiledContract.abi;
}

 function _loadContractProvider(_network) {
   return truffle.networks[_network].provider;
 }
