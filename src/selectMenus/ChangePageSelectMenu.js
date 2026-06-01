const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class ChangePageSelectMenu extends Command {
    constructor(context) {
        super(
            {name:"changePage"},
            context,
        );
    }

    async execute(interaction, client) {
        const user = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );

        const page = parseInt(interaction.values[0]);

        const leaderboard = await this.context.leaderboardService.generateLeaderboard(
            user.color,
            page
        );
        interaction.update({
            flags: user.ephemeralMode ? [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] : MessageFlags.IsComponentsV2,
            components: [leaderboard.container],
            files: [leaderboard.attachment],
        });
    }
}

module.exports = ChangePageSelectMenu;
