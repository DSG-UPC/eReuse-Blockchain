const deviceSchema = require('../schemas/DeviceSchema')
var mongoose, Device

class DeviceDAO {

    constructor(_mongoose) {
        mongoose = _mongoose
        Device = new deviceSchema(mongoose).getDeviceSchema()
    }

    /**
     * Returns a callback that needs to be resolved
     * containing the device with the corresponding
     * wallet.
     * @param {String} _wallet
     * @param {Function} callback
     */
    findByWallet(_wallet, callback) {
        this.findOne({
            wallet: _wallet
        }, callback)
    }

    /**
     * Returns a callback that needs to be resolved
     * containing the device with the corresponding
     * wallet.
     * @param {String} _ip
     * @param {Function} callback
     */
    findByIP(_ip, callback) {
        this.findOne({
            ip: _ip
        }, callback)
    }

    /**
     * Returns a callback that needs to be resolved
     * containing the first device fulfilling the
     * corresponding query.
     * @param {JSON} _query
     * @param {Function} callback
     */
    findOne(_query, callback) {
        Device.findOne(_query, callback)
    }

    /**
     * Returns a promise that needs to be resolved
     * containing a list of the devices fulfilling
     * the corresponding query.
     * @param {JSON} _query
     * @param {Function} callback
     */
    find(_query, callback) {
        if (!_query) {
            return this.findAll(callback)
        } else {
            return Device.find(_query, callback)
        }
    }

    /**
     * Returns a promise that needs to be resolved
     * containing a list of all the devices inside
     * the collection.
     * @param {Function} callback
     */
    findAll(callback) {
        return Device.find({}, callback)
    }

    /**
     * Returns the new device inserted into the collection.
     * @param {JSON} _data
     * @param {Function} callback
     */
    create(_data, callback) {
        Device.create(_data, callback)
    }


    /**
     * Returns the device updated inside the collection.
     * This device is found by means of its wallet.
     * @param {String} _wallet
     * @param {JSON} _new
     * @param {Function} callback
     */
    update(_wallet, _new, callback) {
        Device.findOneAndUpdate({
            wallet: _wallet
        }, _new, {
            new: true
        }, callback)
    }

    /**
     * Returns the device updated inside the collection.
     * This device is found by means of a query.
     * @param {JSON} _query
     * @param {JSON} _new
     * @param {Function} _callback
     */
    updateByQuery(_query, _new, callback) {
        Device.findOneAndUpdate(_query, _new, {
            new: true
        }, callback)
    }

    /**
     * Returns the device deleted from the collection.
     * This device is found by means of its wallet.
     * @param {String} _wallet
     * @param {Function} _callback
     */
    delete(_wallet, callback) {
        Device.findOneAndDelete({
            wallet: _wallet
        }, callback)
    }

    /**
     * Returns the device deleted from the collection.
     * This device is found by means of a query.
     * @param {JSON} _query
     * @param {Function} _callback
     */
    deleteByQuery(_query, callback) {
        Device.findOneAndDelete(_query, callback)
    }
}

module.exports = DeviceDAO
