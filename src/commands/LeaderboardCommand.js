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

        var leaderboard = await this.context.leaderboardService.generateLeaderboard(
            user,
        );
        interaction.reply({
            flags: user.ephemeralMode ? MessageFlags.Ephemeral : [],
            embeds: [leaderboard.embed],
            files: [leaderboard.attachment],
        });
    }
}

module.exports = LeaderboardCommand;
