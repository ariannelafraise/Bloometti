const Event = require('../model/Event')
const User = require('../model/User')
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

        var user = await this.#userService.findById(message.author.id)
        if (user == null) {
            user = await this.#userService.new(await User.new(message.author.id, message.author.username))
        }

        user.setProperty('username', message.author.username)
        
        const leveledUp = await this.#chattingService.expGain(user)

        if (leveledUp)
            await message.channel.send(`<@${user.discordId}> leveled up to level ${user.chatting.level} ! 😊`);
    }
}

module.exports = MessageCreateEvent;
