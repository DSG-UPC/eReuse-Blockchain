/*
Based on https://github.com/robinagist/EthereumWeatherOracle
*/
const web3 = require('./web3');
const fs = require('fs');
const request = require('request');
const Contract = require('./contract.js')
const contract = new Contract('Oracle')


let account;

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  account = accounts[0];
  console.log('Working from account ', account);
};

// run the request method on the contract
console.log("requesting traffic from oracle...")
let c= getAccount().then( function() {
        callContractForRequest(contract);
      }).catch(error => alert(error.message));



async function callContractForRequest(_contract) {
    console.log("calling address: " + _contract.address)
    let MyContract = new web3.eth.Contract(_contract.abi, _contract.address);
    MyContract.options.from = account
    MyContract.options.gas = 100000
    let k = MyContract.methods.request().send()
        .then(function(result) {
            console.log("EVM call to request - got back: " + JSON.stringify(result))
        }, function(error) {
            console.log("error "  + error)
        })
    await k
    return "much success!"
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
