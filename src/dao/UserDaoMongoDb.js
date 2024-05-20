const User = require('../model/User')
const MongoDbConnection = require('./MongoDbConnection')
const UserDaoInterface = require('./UserDaoInterface')
const { collection: COLLECTION } = require('../config/mongo.json')

class UserDaoMongoDb extends UserDaoInterface {

    static #instance = null
    #mongoUsers

    constructor() {
        super()
        if (UserDaoMongoDb.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        this.#mongoUsers = MongoDbConnection.getInstance().dbo.collection(COLLECTION)
        UserDaoMongoDb.#instance = this
    }
    
    static getInstance() {
        if (!UserDaoMongoDb.#instance)
            UserDaoMongoDb.#instance = new UserDaoMongoDb()
        return UserDaoMongoDb.#instance
    }

    async findAll() {
        const users = await this.#mongoUsers.find({}).toArray()
        users.forEach(user => user = new User(user, this))
        return users
    }

    async findById(discordId) {
        const query = { discordId: discordId }
        const user = await this.#mongoUsers.findOne(query)
        return new User(user, this)
    }

    async new(user) {
        return new User(await this.#mongoUsers.insertOne(await user.toJson()), this)
    }

    async existsById(discordId) {
        const query = { discordId: discordId }
        const user = await this.#mongoUsers.findOne(query)
        return user !== null
    }

    async isDeveloperById(discordId) {
        const query = { discordId: discordId }
        const user = await this.#mongoUsers.findOne(query)
        return user.rank === 'developer'
    }

    async setPropertyById(discordId, property, value) {
        const update = { $set: { [property]: value } }
        await this.#mongoUsers.updateOne({discordId: discordId}, update)
    }
    
}

module.exports = UserDaoMongoDb
