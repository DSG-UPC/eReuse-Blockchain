var mongoose = require('mongoose')
var deviceDAO = require('./DAOs/DeviceDAO')
var userDAO = require('./DAOs/UserDAO')
var config = require('../../config')

class MongoHandler {

    constructor() {
        let url = config.mongo
        mongoose.connect(url, {
            useNewUrlParser: true
        })
        this.initializeDAOs(mongoose)
    }

    getUserDAO() {
        return this.userDAO
    }

    getDeviceDAO() {
        return this.deviceDAO
    }

    initializeDAOs(_mongoose) {
        this.userDAO = new userDAO(_mongoose)
        this.deviceDAO = new deviceDAO(_mongoose)
    }

    removeAllData() {
        mongoose.connection.collections['users'].deleteMany()
        mongoose.connection.collections['devices'].deleteMany()
    }

    /**
     * This method returns a list of user JSON object that match the
     * conditions specified in the parameter.
     * @param {JSON} _value A JSON representing the info used for
     *                      filtering and getting the desired users.
     * @param {Function} callback Callback to use the return value.
     */
    findUsers(_value, callback) {
        this.userDAO.find(_value, (err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method returns a user JSON object that matches the
     * conditions specified in the parameter.
     * @param {JSON} _value A JSON representing the info used for
     *                      filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    findUser(_value, callback) {
        this.userDAO.findOne(_value, (err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method returns a user JSON object with the specified
     * wallet passed in as a parameter.
     * @param {String} _wallet A String representing the wallet used
     *                      for filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    findUserByWallet(_wallet, callback) {
        this.userDAO.findByWallet(_wallet, (err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method returns a device JSON object that matches the
     * conditions specified in the parameter.
     * @param {JSON} _value A JSON representing the info used for
     *                      filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    findDevices(_value, callback) {
        this.deviceDAO.find(_value).then((err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method returns a device JSON object that matches the
     * conditions specified in the parameter.
     * @param {JSON} _value A JSON representing the info used for
     *                      filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    findDevice(_value, callback) {
        this.deviceDAO.findOne(_value, (err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method returns a device JSON object with the specified
     * wallet passed in as a parameter.
     * @param {String} _wallet A String representing the wallet used
     *                      for filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    findDeviceByWallet(_wallet, callback) {
        this.deviceDAO.findByWallet(_wallet, (err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method returns a device JSON object with the specified
     * wallet passed in as a parameter.
     * @param {String} _wallet A String representing the wallet used
     *                      for filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    findDeviceByIP(_ip, callback) {
        this.deviceDAO.findByIP(_ip, (err, result) => {
            if (err) {
                console.log(err)
                return err
            }
            callback(result)
        })
    }

    /**
     * This method will do basically two things:
     * 1) Add a new device to the devices collection.
     * 2) Update the list of devices of the corresponding owner.
     * @param {JSON} _value A JSON representing all the required
     *                      data for the new device.
     * @param {Function} callback Callback to use the return value.
     */
    mintDevice(_value, callback) {
        // Then, if owner exists, we create the device and
        // update the owner
        var _this = this
        this.deviceDAO.create(_value, (err, _device) => {
            if (err)
                return err
            _this.userDAO.addDevice(_device, (_err, owner) => {
                if (_err)
                    return err
                callback(owner.devices.pop())
            })
        })
    }

    /**
     * This method will be used to add new users to the database.
     * @param {JSON} _value A JSON representing all the required
     *                      data for the new user.
     * @param {Function} callback Callback to use the return value.
     */
    addUser(_value, callback) {
        this.userDAO.create(_value, (err, result) => {
            if (err)
                return err
            callback(result)
        })
    }

    /**
     * This method will do two things:
     * 1) Delete all the devices owned by the specified user.
     * 2) Delete the user itself.
     * @param {JSON} _value A JSON representing the info used for
     *                      filtering and getting the desired user.
     * @param {Function} callback Callback to use the return value.
     */
    deleteUser(_value, callback) {
        // First of all we check that the specified owner exists
        this.findUserByWallet(_value.owner, (err, _owner) => {
            // Then, if owner exists, we remove the devices and
            // update the owner
            if (err)
                return err
            _owner.devices.map(e => {
                this.deleteDevice(e)
            })
            this.userDAO.delete(_owner.wallet, (err, result) => {
                if (err)
                    return err
                callback(result)
            })
        })
    }

    /**
     * This method will do two things:
     * 1) Delete the device in the list of the owner.
     * 2) Delete the device itself.
     * @param {JSON} _value A JSON representing the info used for
     *                      filtering and getting the desired device.
     * @param {Function} callback Callback to use the return value.
     */
    deleteDevice(_value, callback) {
        // First of all we check that the specified device exists
        this.findDeviceByWallet(_value.wallet, (err, _device) => {
            // Then, if device exists, we remove the devices and
            // update the owner
            if (err)
                return err
            _owner.devices.map(e => {
                if (e == _device.wallet) {
                    this.deviceDAO.delete(e, (err, _deleted) => {
                        if (err)
                            return err
                    })
                }
            })
            callback(_device)
        })
    }

    /**
     * This updates the user with the value obtained.
     * @param {String} _wallet The string representation of the user
     *                          wallet.
     * @param {JSON} _value A JSON representing the info represeting
     *                      the new values for the device to be updated.
     * @param {Function} callback A function used to resolve the result.
     */
    updateUser(_wallet, _value, callback) {
        this.userDAO.update(_wallet, _value, (err, _device) => {
            if (err)
                return err
            callback(_device)
        })
    }

    /**
     * This updates the device with the value obtained.
     * @param {String} _wallet The string representation of the device
     *                          wallet.
     * @param {JSON} _value A JSON representing the info containing
     *                      the new values for the user to be updated.
     * @param {Function} callback A function used to resolve the result.
     */
    updateDevice(_wallet, _value, callback) {
        this.deviceDAO.update(_wallet, _value, (err, _device) => {
            if (err)
                return err
            callback(_device)
        })
    }
}

module.exports = MongoHandler
