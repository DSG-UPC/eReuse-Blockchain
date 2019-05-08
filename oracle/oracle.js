/*
Based on https://github.com/robinagist/EthereumWeatherOracle
*/

//const web3 = require('./oracleWeb3')
const DatabaseHandler = require('./DatabaseHandler')
var databaseHandler

const Contract = require('../contract')
const minimist = require('minimist'),
    argv = minimist(process.argv.slice(2), {
        string: ['network', 'address']
    })
const testAddress = argv['address']
const oracleNetwork = argv['network']
let web3
if (oracleNetwork == 'meshdapp') {
    web3 = require('./oracleWeb3')
} else {
    web3 = require('../ganache-web3')
}
const oracleContract = new Contract('OracleDispatch', oracleNetwork)
var account

const getAccount = async () => {
    //console.log(oracleContract.artifact.updatedAt)
    //console.log(oracleContract.provider);
    //web3.setProvider(oracleContract.provider);
    const accounts = await web3.eth.getAccounts();
    if (oracleNetwork == 'staging') {
        account = accounts[0];
    } else {
        account = accounts[3];
    }
    //console.log(account);
    //web3.setProvider(web.provider)
    console.log(web3.currentProvider);
    databaseHandler = new DatabaseHandler(account);
    console.log('Working from account ', account);
}

let c = getAccount().then(() => {
    console.log("contract address: " + oracleContract.address);
    if (testAddress) {
        startListener(oracleContract.abi, testAddress);
    } else {
        startListener(oracleContract.abi, oracleContract.address);
    }
}, (err) => {
    console.log("shit didn't work.  here's why: " + err)
})


// starts the event listener
async function startListener(abi, address) {
    console.log("starting event monitoring on contract: " + address)
    // console.log("the abi is:" + JSON.stringify(abi, null, 2))
    const myContract = await new web3.eth.Contract(jsonInterface = abi, address = address)
    //myContract.events.Incoming({fromBlock: 537025, toBlock: 'latest'
    myContract.events.Incoming({
            fromBlock: 'latest',
        }, (error, event) => {
            console.log(">>> " + event)
        })
        .on('data', (log) => {
            logData = log.returnValues;
            query = logData.queryType;
            const [server, command] = query.split('^');
            switch (server) {
                case 'nodedb':
                    databaseHandler.setCommand(command)
                    setHandler(databaseHandler)
                    break;
            }
            handler.handle(logData.id, logData.recipient, logData.originator, logData.query,
                (transaction) => {
                    web3.eth.sendTransaction(transaction)
                        .then((result) => {
                            console.log(`EVM call result:\n ${result}`)
                        }, (error) => {
                            console.log(`Error:\n ${error}`)
                        })
                })
            //handler(abi, address)
        })
        .on('changed', (log) => {
            console.log(`Changed: ${log}`)
        })
        .on('error', (log) => {
            console.log(`error:  ${log}`)
        })
}

function setHandler(_handler) {
    handler = _handler
}