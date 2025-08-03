const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageFlags } = require('discord.js')

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
        const user = await this.#userService.findOrCreateById(interaction.user.id, interaction.user.username)
        interaction.reply({ flags: user.ephemeralMode ? MessageFlags.Ephemeral : [], content: `Current ping: ${client.ws.ping}ms`})
	}
}

module.exports = PingCommand
