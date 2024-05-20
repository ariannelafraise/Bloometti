const UserService = require('./UserService');
const {
    chattingExpMultiplier: CHATTING_EXP_MULTIPLIER,
    chattingExpDelayInSeconds: CHATTING_EXP_DELAY_IN_SECONDS,
    chattingExpMinGain: CHATTING_EXP_MIN_GAIN,
    chattingExpMaxGain: CHATTING_EXP_MAX_GAIN
} = require('../config/chatting.json')
const Utils = require('../utils/Utils')

class ChattingService {
    static #instance

    constructor() {
        if (ChattingService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        ChattingService.#instance = this
    }

    static getInstance() {
        if (!ChattingService.#instance)
            ChattingService.#instance = new ChattingService()
        return ChattingService.#instance
    }

    async expGain(user) {
        if ((await Utils.timeSinceEpoch() - user.chatting.lastMessageTime) < CHATTING_EXP_DELAY_IN_SECONDS)
            return

        const gainedExperience = await Utils.randomInt(CHATTING_EXP_MIN_GAIN, CHATTING_EXP_MAX_GAIN) * CHATTING_EXP_MULTIPLIER

        console.log(user.username + ' gained experience')

        const hasLeveledUp = await this.hasLeveledUp(user.chatting.level, user.chatting.expTowardsNextLevel + gainedExperience)

        if (hasLeveledUp[0]) {
            await user.setProperty('chatting.level', user.chatting.level + 1)
            user.setProperty('chatting.expTowardsNextLevel', hasLeveledUp[1])
            user.setProperty('chatting.exp', user.chatting.exp + gainedExperience)
            user.setProperty('chatting.lastMessageTime', await Utils.timeSinceEpoch())
            user.setProperty('chatting.messageCount', user.chatting.messageCount + 1)
            return true
        } else {
            user.setProperty('chatting.expTowardsNextLevel', user.chatting.expTowardsNextLevel + gainedExperience)
            user.setProperty('chatting.exp', user.chatting.exp + gainedExperience)
            user.setProperty('chatting.lastMessageTime', await Utils.timeSinceEpoch())
            user.setProperty('chatting.messageCount', user.chatting.messageCount + 1)
        }
    }

    async hasLeveledUp(level, expTowardsNextLevel) {
        const expNeededToLevelUp = (level * (level + 1)) * 50

        if (expTowardsNextLevel >= expNeededToLevelUp) {
            const newExpTowardsNextLevel = expTowardsNextLevel - expNeededToLevelUp
            return [true, newExpTowardsNextLevel]
        }
    
        return [false, expTowardsNextLevel]
    }
    
}

module.exports = ChattingService
