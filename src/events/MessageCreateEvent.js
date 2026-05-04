const Event = require("../model/Event");

class MessageCreateEvent extends Event {
    constructor(context) {
        super("messageCreate", context);
    }

    async execute(message, client) {
        if (message.author.bot) return;

        const user = await this.context.userService.findOrCreateById(
            message.author.id,
            message.author.username,
        );
        await this.context.userService.update(user, {
            username: message.author.username,
        });
        const leveledUp = await this.context.chattingService.expGain(user);
    }
}

module.exports = MessageCreateEvent;
