const ActivateGWHandler = require('./ActivateGWHandler')
const MintRouterHandler = require('./MintRouterHandler')
const MintClientHandler = require('./MintClientHandler')
const RegisterHandler = require('./RegisterHandler')
const ExistsHandler = require('./ExistsHandler')

/**
 * This class will be used to manage the use of the different handlers
 * available for the database. In this way, it is easier to use them,
 * instead of having all of them in the main class.
 * Each time a new db handler is created, it needs to be added here
 * as well.
 */
class DBHandlerManager {

    constructor() {
        this.activate = new ActivateGWHandler()
        this.mintRouter = new MintRouterHandler()
        this.mintClient = new MintClientHandler()
        this.register = new RegisterHandler()
        this.exists = new ExistsHandler()
    }

    getActivate() {
        return this.activate
    }

    getMintRouter() {
        return this.mintRouter
    }

    getMintClient() {
        return this.mintClient
    }

    getRegister() {
        return this.register
    }

    getExists() {
        return this.exists
    }

}
module.exports = DBHandlerManager
