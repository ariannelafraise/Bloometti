const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class LeaderboardCommand extends Command {
    constructor(context) {
        super(
            new SlashCommandBuilder()
                .setName("leaderboard")
                .setDescription("See the leaderboard"),
            context,
        );
    }

    async execute(interaction, client) {
      const user = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );

        const leaderboard = await this.context.leaderboardService.generateLeaderboard(
            user,
        );
        interaction.reply({
            flags: user.ephemeralMode ? [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] : MessageFlags.IsComponentsV2,
            components: [leaderboard.container],
            files: [leaderboard.attachment],
        });
    }
}

module.exports = LeaderboardCommand;
