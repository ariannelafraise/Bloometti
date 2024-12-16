const { SlashCommandBuilder } = require('@discordjs/builders')

const UserService = require('../control/UserService')
const Command = require('../model/Command')
const { notRegistered } = require('../config/strings.json')

class EphemeralCommand extends Command {

    #userService

    constructor() {
        super(
            new SlashCommandBuilder()
               .setName('ephemeral')
               .setDescription('Toggle the ephemeral mode')
        )

        this.#userService = UserService.getInstance()
    };

    async execute(interaction, client) {
        const user = await this.#userService.findById(interaction.user.id)
        if (user == null) {
            await interaction.reply({ ephemeral: true, content: notRegistered })
        }

        switch (user.ephemeralMode) {
            case true:
                user.setProperty('ephemeralMode', false)
                interaction.reply({ ephemeral: true, content: 'Ephemeral mode toggled off.' })
                break
            
            case false:
                user.setProperty('ephemeralMode', true)
                interaction.reply({ ephemeral: true, content: 'Ephemeral mode toggled on.' })
                break

            default:
                break
        }
    }
}

module.exports = EphemeralCommand
