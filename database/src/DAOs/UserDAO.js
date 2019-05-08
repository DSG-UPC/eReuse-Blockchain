const userSchema = require('../schemas/UserSchema')
var mongoose, User

class UserDAO {

    constructor(_mongoose) {
        mongoose = _mongoose
        User = new userSchema(mongoose).getUserSchema()
    }

    /**
     * Returns a callback that needs to be resolved
     * containing the user with the corresponding
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
     * containing the first user fulfilling the
     * corresponding query.
     * @param {JSON} _query
     * @param {Function} callback
     */
    findOne(_query, callback) {
        User.findOne(_query, (err, result) => {
            callback(err, result)
        })
    }

    /**
     * Returns a callback that needs to be resolved
     * containing a list of the users fulfilling
     * the corresponding query.
     * @param {JSON} _query 
     * @param {Function} callback
     */
    find(_query, callback) {
        if (!_query) {
            this.findAll(callback)
        } else {
            User.find(_query, callback)
        }
    }

    /**
     * Returns a callback that needs to be resolved
     * containing a list of all the users inside
     * the collection.
     * @param {Function} callback
     */
    findAll(callback) {
        User.find({}, callback)
    }

    /**
     * Returns the new user inserted into the collection.
     * @param {JSON} _data 
     * @param {Function} callback
     */
    create(_data, callback) {
        User.create(_data, callback)
    }

    /**
     * Returns the user updated inside the collection.
     * This user is found by means of its wallet.
     * @param {String} _wallet
     * @param {JSON} _new 
     * @param {Function} callback
     */
    update(_wallet, _new, callback) {
        User.findOneAndUpdate({
            wallet: _wallet
        }, _new, {
            new: true
        }, callback)
    }


    /**
     * Returns the user updated inside the collection.
     * This user is found by means of a query.
     * @param {JSON} _query
     * @param {JSON} _new
     * @param {Function} callback
     */
    updateByQuery(_query, _new, callback) {
        User.findOneAndUpdate(_query, _new, {
            new: true
        }, callback)
    }

    /**
     * Updates a given user (owner of the device)
     * adding the device wallet to its list of owned
     * devices.
     * @param {String} _wallet 
     * @param {Function} callback
     */
    addDevice(_device, callback) {
        this.findByWallet(_device.owner, (err, user) => {
            if (err)
                return err
            user.devices.push(_device.wallet)
            this.update(user.wallet, user, callback)
        })
    }

    /**
     * Returns the user deleted from the collection.
     * This user is found by means of its wallet.
     * @param {String} _wallet
     * @param {Function} callback
     */
    delete(_wallet, callback) {
        User.findOneAndDelete({
            wallet: _wallet
        }, callback)
    }

    /**
     * Returns the user deleted from the collection.
     * This user is found by means of a query.
     * @param {JSON} _query 
     * @param {Function} callback 
     */
    deleteByQuery(_query, callback) {
        User.findOneAndDelete(_query, callback)
    }
}

module.exports = UserDAO