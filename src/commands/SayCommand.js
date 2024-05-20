const { SlashCommandBuilder } = require('@discordjs/builders')

const UserService = require('../control/UserService')
const Command = require('../model/Command')
const { accessDeniedMessage } = require('../config/strings.json')

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
        const user = await this.#userService.findById(interaction.user.id)

        // If the user does not exist in the database
        if (user == null) {
            await interaction.reply({ ephemeral: ephemeralMode, content: 'This user isn\'t registered yet.' });
            return;
        }

        // Verify if user has permission to use the command
        if (!await user.isDeveloper()) { 
            await interaction.reply({ ephemeral: true, content: accessDeniedMessage})
            return
        }

        await interaction.channel.send(interaction.options.getString('message'))
        await interaction.reply({ ephemeral: true, content: 'Message sent.' })
	}
}

module.exports = SayCommand
