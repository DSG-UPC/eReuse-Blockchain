var Float
class DeviceSchema {

    constructor(_mongoose) {
        this.mongoose = _mongoose
        Float = require('mongoose-float').loadType(this.mongoose)
    }

    getDeviceSchema() {
        var deviceSchema = this.mongoose.Schema({
            name: {
                type: String
            },
            price: {
                type: Float
            },
            ip: {
                type: String,
                required: true
            },
            deviceType: {
                type: String,
                enum: ['Router', 'Gateway'],
                required: true
            },
            owner: {
                type: String,
                required: true
            },
            wallet: {
                type: String,
                required: true,
                unique: true
            },
        }, {
            collection: 'devices'
        })
        return this.mongoose.model('Device', deviceSchema)
    }
}
module.exports = DeviceSchema