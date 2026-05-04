const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");

class PingCommand extends Command {
    constructor(context) {
        super(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Get the current ping of the bot"),
            context,
        );
    }

    async execute(interaction, client) {
        const user = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );
        interaction.reply({
            flags: user.ephemeralMode ? MessageFlags.Ephemeral : [],
            content: `Current ping: ${client.ws.ping}ms`,
        });
    }
}

module.exports = PingCommand;
