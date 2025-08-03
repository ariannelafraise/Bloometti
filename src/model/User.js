const {
    defaultColor: DEFAULT_COLOR,
    defaultEphemeral: DEFAULT_EPHEMERAL,
} = require('../config/defaults.json')

class User {

    constructor(json) {
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
    }

    static new(discordId, username) {
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
        })
    }

    toJson() {
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

    updateFields(updatedFields) {
        for (const field in updatedFields) {
            this[field] = updatedFields[field]
        }
    }
}

module.exports = User
