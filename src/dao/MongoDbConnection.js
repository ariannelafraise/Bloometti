const { MongoClient } = require('mongodb')

const { url: URL, db: DB } = require('../config/mongo.json')
const LoggingService = require('../control/LoggingService')

class MongoDbConnection {
    static #instance = null
    dbo
    #loggingService
    
    constructor(loggingService) {
        if (MongoDbConnection.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        MongoDbConnection.#instance = this
        this.#loggingService = loggingService
        MongoDbConnection.#instance.connect()
    }

    static getInstance() {
        if (!MongoDbConnection.#instance)
            MongoDbConnection.#instance = new MongoDbConnection(LoggingService.getInstance())
        return MongoDbConnection.#instance
    }

    connect() {
        const log = 'MongoDB: Connection established.' 
        const client = new MongoClient(URL)
        client.connect()
        console.log(log)
        this.#loggingService.log('Database', log)
        this.dbo = client.db(DB)
    }
}

module.exports = MongoDbConnection
