const {
    defaultColor: DEFAULT_COLOR,
    defaultEphemeral: DEFAULT_EPHEMERAL,
} = require('../config/defaults.json')

class User {

    #userDao

    constructor(json, userDao) {
        this.discordId = json.discordId
        this.username = json.username
        this.ephemeralMode = json.ephemeralMode
        this.color = json.color
        this.rank = json.rank
        this.chatting = {
            exp: json.chatting.exp,
            expTowardsNextLevel: json.chatting.expTowardsNextLevel,
            lastMessageTime: json.chatting.lastMessageTime,
            level: json.chatting.level,
            messageCount: json.chatting.messageCount
        }
        this.bankAccount = {
            balance: json.bankAccount.balance
        }

        this.#userDao = userDao
    }

    static async new(discordId, username) {
        return new User({
            discordId: discordId,
            username: username,
            ephemeralMode: DEFAULT_EPHEMERAL,
            color: DEFAULT_COLOR,
            rank: 'user',
            chatting: {
                exp: 0,
                expTowardsNextLevel: 0,
                lastMessageTime: 0,
                level: 0,
                messageCount: 0
            },
            bankAccount: {
                balance: 0
            }
        }, null)
    }

    async toJson() {
        return {
            discordId: this.discordId,
            username: this.username,
            ephemeralMode: this.ephemeralMode,
            color: this.color,
            rank: this.rank,
            chatting: {
                exp: this.chatting.exp,
                expTowardsNextLevel: this.chatting.expTowardsNextLevel,
                lastMessageTime: this.chatting.lastMessageTime,
                level: this.chatting.level,
                messageCount: this.chatting.messageCount
            },
            bankAccount: {
                balance: this.bankAccount.balance
            }
        }
    }

    async isDeveloper() {
        return await this.#userDao.isDeveloperById(this.discordId)
    }

    async setProperty(property, value) {
        const keys = property.split('.')
        const lastKey = keys.pop()

        let target = this
        for (const key of keys) {
            target = target[key]
        }

        target[lastKey] = value
        this.#userDao.setPropertyById(this.discordId, property, value)
    }
}

module.exports = User
