const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageFlags } = require('discord.js')

const UserService = require('../control/UserService')
const Command = require('../model/Command')
const { accessDenied } = require('../config/strings.json')

class SayCommand extends Command {

    #userService

    constructor() {
        super(
            new SlashCommandBuilder()
               .setName('say')
               .setDescription('Make Bloometti say whatever you want')
               .addStringOption(option =>
                    option.setName('message')
                   .setDescription('The message you want Bloometti to say')
                   .setRequired(true))
        )

        this.#userService = UserService.getInstance()
    }

    async execute(interaction, client) {
        const user = await this.#userService.findOrCreateById(interaction.user.id, interaction.user.username)
        if (user.rank != 'developer') { 
            interaction.reply({ flags: MessageFlags.Ephemeral, content: accessDenied})
            return
        }
        await interaction.channel.send(interaction.options.getString('message'))
        interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Message sent.' })
	}
}

module.exports = SayCommand
