const MongoHandler = require('../database/src/MongoHandler')
const Manager = require('./database_handlers/DBHandlerManager')
const OracleHandler = require('./OracleHandler')
const web3 = require('../web3')


class DatabaseHandler extends OracleHandler {

    constructor(_account) {
        super()
        this.account = _account
        this.mongoHandler = new MongoHandler()
        this.manager = new Manager()
        this.command = ''
    }

    handle(_id, _recipient, _originator, _data, callback) {
        let _this = this
        let ip
        switch (this.command) {
            case 'mintRouter':
                ip = _data
                console.log(ip)
                _this.manager.getMintRouter().getWalletAddress(ip, _originator, (walletAddress) => {
                    _this.mongoHandler.findDeviceByIP(ip, (result) => {
                        if (web3.utils.toChecksumAddress(result.wallet) == web3.utils.toChecksumAddress(walletAddress)) {
                            console.log(result.id)
                            console.log(web3.utils.toBN(result.id))
                            _this.manager.getMintRouter().getTransaction(_this.account, _recipient,
                                _originator, result, callback)
                        } else
                            throw "Router Device wallet doesn't match DB wallet"
                    })
                })
                break
            case 'mintClient':
                ip = _data
                console.log(ip)
                _this.manager.getMintClient().getWalletAddress(ip, _originator, (walletAddress) => {
                    //TODO fix client ids
                    let id = Math.random().toString().slice(2, 11);
                    _this.manager.getMintClient().getTransaction(_this.account, _recipient,
                        _originator, id, ip, walletAddress, callback)
                })
                break
                /* FOR FUTURE USAGE
                case 'register':
                    _this.handler.addUser(JSON.parse(_data), (_user) => {
                        _this.manager.getRegister().getTransaction(_this.account, _recipient,
                            _user, callback)
                    })
                    break
                case 'exists':
                    _this.handler.findDeviceByWallet(_data, (_device) => {
                        _this.manager.getExists().getTransaction(_this.account, _recipient,
                            _device, callback)
                    })
                    break
                */
            case 'activateGW':
                _this.mongoHandler.findDeviceByWallet(_data, (result) => {
                    if (result) {
                        let res = result
                        res['deviceType'] = 'Gateway'
                        _this.mongoHandler.updateDevice(res.wallet, res, (_newDevice) => {
                            _this.manager.getActivate().getTransaction(_this.account,
                                _recipient, _newDevice, callback)
                        })
                    }
                })
                break
            default:
                throw TypeError
        }
    }

    getDatabase() {
        return this.mongoHandler
    }

    setCommand(_command) {
        this.command = _command
    }
}

module.exports = DatabaseHandler