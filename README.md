# eReuse Blockchain

This repository contains a Blockchain approach of the eReuse system.


## Compile

```javascript
$npm install //install necessary node modules
$node_modules/.bin/truffle compile --all --reset //compile Solidity contracts
```

## Deploy Locally
In a different terminal or a `screen` start a ganache instance by executing `node_modules/.bin/ganache`
and then deploy locally the smart contracts by executing 
```javascript
$node_modules/.bin/truffle migrate --network development //deploy Solidity contracts
```

## Export to Go
To export in Go :
1. Install [abigen](https://github.com/ethereum/go-ethereum/wiki/Installing-Geth)
2. Deploy locally the smart contracts (so that truffle generates the bytecode)
3. Run `node abigen`
4. In the `go` directory you should find the `.go` file with the Ethereum bindings