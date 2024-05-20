const { MongoClient } = require('mongodb')

const { url: URL, db: DB } = require('../config/mongo.json')

class MongoDbConnection {
    static #instance = null
    dbo
    
    constructor() {
        if (MongoDbConnection.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        MongoDbConnection.#instance = this
        MongoDbConnection.#instance.connect()
    }

    static getInstance() {
        if (!MongoDbConnection.#instance)
            MongoDbConnection.#instance = new MongoDbConnection()
        return MongoDbConnection.#instance
    }

    connect() {
        const client = new MongoClient(URL)
        client.connect()
        console.log('Connected to MongoDB')
        this.dbo = client.db(DB)
    }
}

module.exports = MongoDbConnection
