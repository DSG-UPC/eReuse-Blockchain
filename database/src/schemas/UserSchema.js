class UserSchema {
    constructor(_mongoose) {
        this.mongoose = _mongoose
    }

    getUserSchema() {
        var userSchema = this.mongoose.Schema({
            name: String,
            age: Number,
            pubKey: {
                type: String,
                required: true,
                unique: true
            },
            devices: [{
                type: String,
            }, ],
            role: {
                type: String,
                enum: ['Client', 'Provider'],
                required: true
            },
            wallet: {
                type: String,
                required: true,
                unique: true
            },
        }, {
            collection: 'users'
        })
        return this.mongoose.model('User', userSchema)
    }
}

module.exports = UserSchema