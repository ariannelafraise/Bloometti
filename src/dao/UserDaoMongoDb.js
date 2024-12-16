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
        try {
            const users = await this.#mongoUsers.find({}).toArray()
            users.forEach(user => user = new User(user, this))
            return users
        } catch (e) {
            console.error(e);
        }
    }

    async findById(discordId) {
        const query = { discordId: discordId }
        try {
            const user = await this.#mongoUsers.findOne(query)
            if (user == null)
                return null
            return new User(user, this)
        } catch (e) {
            console.error(e);
        }
    }

    async new(user) {
        try {
            return new User(await this.#mongoUsers.insertOne(await user.toJson()), this)
        } catch (e) {
            console.error(e);
        }
    }

    async existsById(discordId) {
        const user = await this.findById(discordId)
        return user !== null
    }

    async isDeveloperById(discordId) {
        const user = await this.findById(discordId)
        return user.rank === 'developer'
    }

    async setPropertyById(discordId, property, value) {
        const update = { $set: { [property]: value } }
        try {
            await this.#mongoUsers.updateOne({discordId: discordId}, update)
        } catch (e) {
            console.error(e);
        }
    }
    
}

module.exports = UserDaoMongoDb
