const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageFlags } = require('discord.js')

const Command = require('../model/Command')
const ProfileService = require('../control/ProfileService')
const UserService = require('../control/UserService')

class ProfileCommand extends Command {

    #profileService
    #userService

    constructor() {
        super(
            new SlashCommandBuilder()
               .setName('profile')
               .setDescription('See your profile')
               .addUserOption(option => option.setName('user').setDescription('The user you want to see the profile of').setRequired(false))
        )

        this.#profileService = ProfileService.getInstance()
        this.#userService = UserService.getInstance()
    }

    async execute(interaction, client) {
        let userToShow
        if (interaction.options.getUser('user')) {
            userToShow = interaction.options.getUser('user')
        } else {
            userToShow = interaction.user
        }
        const user = await this.#userService.findOrCreateById(userToShow.id, userToShow.username)
        
        var profile = await this.#profileService.generateProfile(user, userToShow.avatarURL())
        interaction.reply({flags: user.ephemeralMode ? MessageFlags.Ephemeral : [], embeds: [profile.embed], files: [profile.attachment]})
	}
}

module.exports = ProfileCommand
