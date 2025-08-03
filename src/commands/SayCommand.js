const { SlashCommandBuilder } = require('@discordjs/builders')

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
            interaction.reply({ ephemeral: true, content: accessDenied})
            return
        }
        await interaction.channel.send(interaction.options.getString('message'))
        interaction.reply({ ephemeral: true, content: 'Message sent.' })
	}
}

module.exports = SayCommand
