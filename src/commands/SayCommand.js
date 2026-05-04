const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageFlags } = require("discord.js");

const Command = require("../model/Command");
const { accessDenied } = require("../config/strings.json");

class SayCommand extends Command {
    constructor(context) {
        super(
            new SlashCommandBuilder()
                .setName("say")
                .setDescription("Make Bloometti say whatever you want")
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("The message you want Bloometti to say")
                        .setRequired(true),
                ),
            context,
        );
    }

    async execute(interaction, client) {
        const user = await this.context.userService.findOrCreateById(
            interaction.user.id,
            interaction.user.username,
        );
        if (user.rank != "developer") {
            interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: accessDenied,
            });
            return;
        }
        await interaction.channel.send(
            interaction.options.getString("message"),
        );
        interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: "Message sent.",
        });
    }
}

module.exports = SayCommand;
