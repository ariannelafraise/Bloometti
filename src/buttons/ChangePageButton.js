const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class ChangePageButton extends Command {
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

        let page = interaction.customId.split("_")[1];

        if (page === "first") {
            page = 1;
        } else if (page === "last") {
            page = Infinity;
        } else {
            page = parseInt(page);
        }

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

module.exports = ChangePageButton;
