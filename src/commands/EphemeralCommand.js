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
        var user = await this.#userService.findOrCreateById(interaction.user.id, interaction.user.username)
        switch (user.ephemeralMode) {
            case true:
                await this.#userService.update(user, {'ephemeralMode' : false})
                interaction.reply({ ephemeral: true, content: 'Ephemeral mode toggled off.' })
                break
            
            case false:
                await this.#userService.update(user, {'ephemeralMode' : true})
                interaction.reply({ ephemeral: true, content: 'Ephemeral mode toggled on.' })
                break
        }
    }
}

module.exports = EphemeralCommand
