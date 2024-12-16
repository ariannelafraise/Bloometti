const UserDaoMongoDb = require('../dao/UserDaoMongoDb')

class UserService {

    static #instance = null
    #userDao

    constructor(userDao) {
        if (UserService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        UserService.#instance = this
        this.#userDao = userDao
    }

    static getInstance() {
        if (!UserService.#instance)
            UserService.#instance = new UserService(UserDaoMongoDb.getInstance())
        return UserService.#instance
    }

    async findAll() {
        return this.#userDao.findAll()
    }

    async findById(discordId) {
        return this.#userDao.findById(discordId)
    }

    async new(user) {
        return this.#userDao.new(user)
    }

    async existsById(discordId) {
        return this.#userDao.existsById(discordId)
    }
}

module.exports = UserService
