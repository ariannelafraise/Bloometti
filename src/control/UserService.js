const UserDaoMongoDb = require('../dao/UserDaoMongoDb')
const User = require('../model/User');
const LoggingService = require('./LoggingService');

class UserService {

    static #instance = null
    #userDao
    #loggingService

    constructor(userDao, loggingService) {
        if (UserService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        UserService.#instance = this
        this.#userDao = userDao
        this.#loggingService = loggingService
    }

    static getInstance() {
        if (!UserService.#instance)
            UserService.#instance = new UserService(UserDaoMongoDb.getInstance(), LoggingService.getInstance())
        return UserService.#instance
    }

    async findAll() {
        return await this.#userDao.findAll()
    }

    async findOrCreateById(discordId, username) {
        try {
            return await this.#userDao.findById(discordId)
        } catch (e) {
            if (e.name == 'UserNotFoundException') {
                const user = User.new(discordId, username)
                await this.new(user)
                return user
            }
        }
    }

    async new(user) {
        this.#loggingService.log('Users', `${user.username} (Discord ID: ${user.discordId}) was registered.`)
        await this.#userDao.new(user)
    }

    async update(user, updatedFields) {
        await this.#userDao.updateById(user.discordId, updatedFields)
        user.updateFields(updatedFields)
    }
}

module.exports = UserService
