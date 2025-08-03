const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageFlags } = require('discord.js')

const Command = require('../model/Command');
const UserService = require('../control/UserService')
const ProfileService = require('../control/ProfileService')
const { defaultColor } = require('../config/defaults.json')
const { invalidHex } = require('../config/strings.json')

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
        const user = await this.#userService.findOrCreateById(interaction.user.id, interaction.user.username)
        
        let hexCodeInput = interaction.options.getString('hexcode')
        if (!hexCodeInput.startsWith('#'))
            hexCodeInput = `#${hexCodeInput}`

        switch (SetColorCommand.#VALIDHEX.test(hexCodeInput)) {
            case true:
                await this.#userService.update(user, {color: hexCodeInput})
                const { embed, attachment } = await this.#profileService.generateSetColor(hexCodeInput)
                interaction.reply({ flags: user.ephemeralMode ? MessageFlags.Ephemeral : [], embeds: [embed], files: [attachment]});
                return

            case false:
                interaction.reply({ flags: user.ephemeralMode ? MessageFlags.Ephemeral : [], content: invalidHex});
                return
        }
	}
}

module.exports = SetColorCommand