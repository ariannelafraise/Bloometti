const { SlashCommandBuilder } = require('@discordjs/builders')

const UserService = require('../control/UserService')
const Command = require('../model/Command')

class PingCommand extends Command {

    #userService

    constructor() {
        super(
            new SlashCommandBuilder()
               .setName('ping')
               .setDescription('Get the current ping of the bot')
        )

        this.#userService = UserService.getInstance()
    }

    async execute(interaction, client) {
        const user = await this.#userService.findById(interaction.user.id)

        interaction.reply({ ephemeral: user.ephemeralMode, content: `Current ping: ${client.ws.ping}ms`})
	}
}

module.exports = PingCommand
