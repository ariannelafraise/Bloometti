const User = require("../model/User");

class UserService {
    #userDao;
    #loggingService;

    constructor(userDao, loggingService) {
        this.#userDao = userDao;
        this.#loggingService = loggingService;
    }

    async findAll() {
        return await this.#userDao.findAll();
    }

    async findOrCreateById(discordId, username) {
        try {
            return await this.#userDao.findById(discordId);
        } catch (e) {
            if (e.name == "UserNotFoundException") {
                const user = User.new(discordId, username);
                await this.new(user);
                return user;
            }
        }
    }

    async new(user) {
        this.#loggingService.log(
            "Users",
            `${user.username} (Discord ID: ${user.discordId}) was registered.`,
        );
        await this.#userDao.new(user);
    }

    async update(user, updatedFields) {
        await this.#userDao.updateById(user.discordId, updatedFields);
        user.updateFields(updatedFields);
    }
}

module.exports = UserService;
