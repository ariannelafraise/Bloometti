const { SlashCommandBuilder } = require('@discordjs/builders')
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')

const Command = require('../model/Command');
const UserService = require('../control/UserService')
const ProfileService = require('../control/ProfileService')
const { defaultColor } = require('../config/defaults.json')
const { notRegistered } = require('../config/strings.json')

class SetColorCommand extends Command {

    #userService
    #profileService
    static #VALIDHEX = /^#[0-9A-F]{6}$/i

    constructor() {
        super(
            new SlashCommandBuilder()
               .setName('setcolor')
               .setDescription('Set the color that the bot will use for you')
               .addStringOption(option =>
                    option.setName('hexcode')
                       .setDescription(`Color code (Hexadecimal, e.g.: "${defaultColor}; use a color picker to find the hex code of a color)`)
                       .setRequired(true))
        );

        this.#profileService = ProfileService.getInstance()
        this.#userService = UserService.getInstance()
    }

    async execute(interaction, client) {
        const user = await this.#userService.findById(interaction.user.id)
        if (user == null) {
            await interaction.reply({ ephemeral: true, content: notRegistered })
        }
        
        let hexCodeInput = interaction.options.getString('hexcode')

        if (!hexCodeInput.startsWith('#'))
            hexCodeInput = `#${hexCodeInput}`

        switch (SetColorCommand.#VALIDHEX.test(hexCodeInput)) {
            case true:
                user.setProperty('color', hexCodeInput)
                const { embed, attachment } = await this.#profileService.generateSetColor(hexCodeInput)
                interaction.reply({ ephemeral: user.ephemeralMode, embeds: [embed], files: [attachment]});
                break;

            case false:
                interaction.reply({ ephemeral: user.ephemeralMode, content:'This isn\'t a valid hex string, please try again.' });
                break;

            default:
                interaction.reply({ ephemeral: user.ephemeralMode, content:'Unexpected error.' });
                break;
        }
	}
}

module.exports = SetColorCommand