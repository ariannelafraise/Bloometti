const Canvas = require('canvas')
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')

const UserService = require('../control/UserService')

class ProfileService {
    static #instance = null
    #userService
    
    constructor(userService) {
        if (ProfileService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        ProfileService.#instance = this
        this.#userService = userService
    }

    static getInstance() {
        if (!ProfileService.#instance)
            ProfileService.#instance = new ProfileService(UserService.getInstance())
        return ProfileService.#instance
    }

    async generateProfile(user, interactionUser) {
        const attachment = await this.generateProgressBar(user);

        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setAuthor({ name: `${interactionUser.username}`, iconURL: `${interactionUser.avatarURL()}` })
            .addFields(
                {
                    name: `Level ${user.chatting.level}`,
                    value: `${user.chatting.expTowardsNextLevel} / ${(user.chatting.level * (user.chatting.level + 1)) * 50}`,
                    inline: true},
            )
            .setImage('attachment://progress-bar.png')

        return { embed, attachment }
    }

    async generateProgressBar(user) {
        // Setup canvas
        const canvas = Canvas.createCanvas(1000, 25)
        const context = canvas.getContext('2d')

        // Fill the background
        const background = await Canvas.loadImage('../public/progressBarBackground.jpg')
        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        // Calculate the progress percentage
        const levelCompletionPercentage = Math.floor((user.chatting.expTowardsNextLevel / ((user.chatting.level * (user.chatting.level + 1)) * 50)) * 100)

        // Fill the progress bar
        context.fillStyle = user.color
        context.fillRect(0, 0, 1000 * (levelCompletionPercentage / 100), 25)

        // Export the progress bar image as png
        return new AttachmentBuilder(canvas.toBuffer(), { name: 'progress-bar.png'})
    }

    async generateSetColor(hexCode) {
        const attachment = await this.generateColorSquare(hexCode)

        const embed = new EmbedBuilder()
        .setColor(hexCode)
        .setTitle(`Color set to: ${hexCode.toUpperCase()}`)
        .setImage('attachment://color.png')
    
        return {embed, attachment}
    }

    async generateColorSquare(hexCode) {
        const canvas = Canvas.createCanvas(32, 32)
        const context = canvas.getContext('2d')
    
        context.fillStyle = hexCode
        context.fillRect(0, 0, canvas.width, canvas.height)
    
        return new AttachmentBuilder(canvas.toBuffer(), { name: 'color.png' })
    }
}

module.exports = ProfileService
