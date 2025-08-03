const Event = require('../model/Event')
const UserService = require('../control/UserService')
const ChattingService = require('../control/ChattingService')

class MessageCreateEvent extends Event {

    #userService
    #chattingService

    constructor() {
        super('messageCreate')

        this.#userService = UserService.getInstance()
        this.#chattingService = ChattingService.getInstance()
    }

    async execute(message, client) {
        if (message.author.bot) return

        const user = await this.#userService.findOrCreateById(message.author.id, message.author.username)
        await this.#userService.update(user, {username: message.author.username})
        const leveledUp = await this.#chattingService.expGain(user)

        //if (leveledUp)
        //    message.channel.send(`<@${user.discordId}> leveled up to level ${user.chatting.level} ! 😊`);
    }
}

module.exports = MessageCreateEvent;
