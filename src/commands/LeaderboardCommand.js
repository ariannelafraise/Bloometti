const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class LeaderboardCommand extends Command {
    constructor(context) {
        super(
            new SlashCommandBuilder()
                .setName("leaderboard")
                .setDescription("See the server's leaderboard"),
            context,
        );
    }

    async execute(interaction, client) {
      const user = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );

        var profile = await this.context.leaderboardService.generateLeaderboard(
            user,
            await this.context.userService.findAll(),
        );
        interaction.reply({
            flags: user.ephemeralMode ? MessageFlags.Ephemeral : [],
            embeds: [profile.embed],
            files: [profile.attachment],
        });
    }
}

module.exports = LeaderboardCommand;
