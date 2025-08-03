const User = require('../model/User')
const MongoDbConnection = require('./MongoDbConnection')
const UserDaoInterface = require('./UserDaoInterface')
const { collection: COLLECTION } = require('../config/mongo.json')
const { default: UserNotFoundException } = require('../errors/UserNotFoundException')

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
        const users = await this.#mongoUsers.find().toArray()
        users.forEach(user => user = new User(user))
        return users
    }

    async findById(discordId) {
        const query = { discordId: discordId }
        const user = await this.#mongoUsers.findOne(query)
        if (user === null) throw new UserNotFoundException()
        else return new User(user)
    }

    async new(user) {
        await this.#mongoUsers.insertOne(user.toJson())
    }

    async updateById(discordId, updatedFields) {
        await this.#mongoUsers.updateOne({discordId: discordId}, { $set: updatedFields })
    }
    
}

module.exports = UserDaoMongoDb
