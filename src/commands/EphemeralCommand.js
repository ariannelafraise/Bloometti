const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class EphemeralCommand extends Command {
    constructor(context) {
        super(
            new SlashCommandBuilder()
                .setName("ephemeral")
                .setDescription("Toggle the ephemeral mode"),
            context,
        );
    }

    async execute(interaction, client) {
        var user = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );
        switch (user.ephemeralMode) {
            case true:
                await this.context.userService.update(user, {
                    ephemeralMode: false,
                });
                interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: "Ephemeral mode toggled off.",
                });
                break;

            case false:
                await this.context.userService.update(user, {
                    ephemeralMode: true,
                });
                interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: "Ephemeral mode toggled on.",
                });
                break;
        }
    }
}

module.exports = EphemeralCommand;
