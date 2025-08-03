const {
    chattingExpMultiplier: CHATTING_EXP_MULTIPLIER,
    chattingExpDelayInSeconds: CHATTING_EXP_DELAY_IN_SECONDS,
    chattingExpMinGain: CHATTING_EXP_MIN_GAIN,
    chattingExpMaxGain: CHATTING_EXP_MAX_GAIN
} = require('../config/chatting.json')
const Utils = require('../utils/Utils')
const UserService = require('./UserService')

class ChattingService {
    static #instance
    #userService

    constructor(userService) {
        if (ChattingService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        ChattingService.#instance = this
        this.#userService = userService
    }

    static getInstance() {
        if (!ChattingService.#instance)
            ChattingService.#instance = new ChattingService(UserService.getInstance())
        return ChattingService.#instance
    }

    async expGain(user) {
        if ((Utils.timeSinceEpoch() - user.chatting.lastMessageTime) < CHATTING_EXP_DELAY_IN_SECONDS)
            return false

        const gainedExperience = Utils.randomInt(CHATTING_EXP_MIN_GAIN, CHATTING_EXP_MAX_GAIN) * CHATTING_EXP_MULTIPLIER

        const hasLeveledUp = this.hasLeveledUp(user.chatting.level, user.chatting.expTowardsNextLevel + gainedExperience)

        let updatedFields = {
            chatting : {}
        }
        if (hasLeveledUp[0]) {
            updatedFields.chatting.level = user.chatting.level + 1
            updatedFields.chatting.expTowardsNextLevel = hasLeveledUp[1]
        } else {
            updatedFields.chatting.level = user.chatting.level
            updatedFields.chatting.expTowardsNextLevel = user.chatting.expTowardsNextLevel + gainedExperience
        }
        updatedFields.chatting.lastMessageTime = Utils.timeSinceEpoch()
        updatedFields.chatting.messageCount = user.chatting.messageCount + 1
        updatedFields.chatting.exp = user.chatting.exp + gainedExperience
        await this.#userService.update(user, updatedFields)
        
        if (hasLeveledUp[0])
            return true
        else
            return false
    }

    hasLeveledUp(level, expTowardsNextLevel) {
        const expNeededToLevelUp = ChattingService.calculateExpNeededToLevelUp(level)

        if (expTowardsNextLevel >= expNeededToLevelUp) {
            const newExpTowardsNextLevel = expTowardsNextLevel - expNeededToLevelUp
            return [true, newExpTowardsNextLevel]
        }
    
        return [false, expTowardsNextLevel]
    }

    static calculateExpNeededToLevelUp(level) {
        return level ** 2 * 75 + 1000
    }
}

module.exports = ChattingService
