const { MessageFlags } = require("discord.js");

const Button = require("../model/Button");

class ChangePageButton extends Button {
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

        const page = parseInt(interaction.customId.split("_")[1]);

        const leaderboard = await this.context.leaderboardService.generateLeaderboard(
            user,
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
