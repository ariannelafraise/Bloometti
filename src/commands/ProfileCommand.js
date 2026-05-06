const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class ProfileCommand extends Command {
    constructor(context) {
        super(
            new SlashCommandBuilder()
                .setName("profile")
                .setDescription("See your profile")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription(
                            "The user you want to see the profile of",
                        )
                        .setRequired(false),
                ),
            context,
        );
    }

    async execute(interaction, client) {
        let userParam;
        if (interaction.options.getUser("user")) {
            userParam = interaction.options.getUser("user");
        } else {
            userParam = interaction.user;
        }

        const userToShow = await this.context.userService.findOrCreateById(
            userParam.id,
            userParam.username,
        );

        const userRequesting = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );

        var profile = await this.context.profileService.generateProfile(
            user,
            userParam.avatarURL(),
        );

        interaction.reply({
            flags: userRequesting.ephemeralMode ? MessageFlags.Ephemeral : [],
            embeds: [profile.embed],
            files: [profile.attachment],
        });
    }
}

module.exports = ProfileCommand;
