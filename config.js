var config = {
    mongo: getMongoIP(),
    ethereum_provider: process.env.ETH_NET || 'http://127.0.0.1:8545',
};

function getMongoIP() {
    let ip = process.env.MONGO_IP || '127.0.0.1:27017'
    return `mongodb://ammbr:4mmBr_P4ssW0rd@${ip}/ammbr`;
}

module.exports = config
