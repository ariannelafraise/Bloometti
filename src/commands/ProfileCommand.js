const { SlashCommandBuilder } = require('@discordjs/builders')

const Command = require('../model/Command')
const ProfileService = require('../control/ProfileService')
const UserService = require('../control/UserService')
const { notRegistered } = require('../config/strings.json')

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

        const user = await this.#userService.findById(interaction.user.id)
        if (user == null) {
            await interaction.reply({ ephemeral: true, content: notRegistered })
        }

        let profile;

        const interactionRequestedUser = interaction.options.getUser('user')
        if (interactionRequestedUser) {
            const requestedUser = await this.#userService.findById(interaction.options.getUser('user').id)
            profile = await this.#profileService.generateProfile(requestedUser, interactionRequestedUser)
        } else {
            profile = await this.#profileService.generateProfile(user, interaction.user)
        }

        interaction.reply({ephemeral: user.ephemeralMode, embeds: [profile.embed], files: [profile.attachment]})
	}
}

module.exports = ProfileCommand
