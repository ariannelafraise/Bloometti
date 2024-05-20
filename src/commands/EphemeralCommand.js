const { SlashCommandBuilder } = require('@discordjs/builders')

const UserService = require('../control/UserService')
const Command = require('../model/Command')

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
