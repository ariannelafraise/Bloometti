const Canvas = require('canvas')
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const ChattingService = require('./ChattingService')

class ProfileService {
    static #instance = null
    
    constructor() {
        if (ProfileService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        ProfileService.#instance = this
    }

    static getInstance() {
        if (!ProfileService.#instance)
            ProfileService.#instance = new ProfileService()
        return ProfileService.#instance
    }

    async generateProfile(user, avatarUrl) {
        const attachment = await this.generateProgressBar(user);

        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setAuthor({ name: `${user.username}`, iconURL: avatarUrl })
            .addFields(
                {
                    name: `Level ${user.chatting.level}`,
                    value: `${user.chatting.expTowardsNextLevel} / ${ChattingService.calculateExpNeededToLevelUp(user.chatting.level)}`,
                    inline: true},
            )
            .setImage('attachment://progress-bar.png')

        return { embed, attachment }
    }

    async generateProgressBar(user) {
        const canvasHeight = 100
        const canvasWidth = 2000
        // Setup canvas
        const canvas = await Canvas.createCanvas(canvasWidth, canvasHeight)
        const context = await canvas.getContext('2d')

        // Fill the background
        const background = await Canvas.loadImage('../public/progressBarBackground.jpg')
        context.drawImage(background, 0, 0)

        // Calculate the progress percentage
        const levelCompletionPercentage = Math.floor((user.chatting.expTowardsNextLevel / ChattingService.calculateExpNeededToLevelUp(user.chatting.level)) * 100)

        // Fill the progress bar
        // context.fillStyle = user.color
        // context.fillStyle = "#ff43aeb7"
        // context.fillRect(0, 0, 1000 * (levelCompletionPercentage / 100), 100)

        const progressBar = await Canvas.loadImage('../public/saturne-cropped.png')
        const progressBarWidth = canvasWidth * (levelCompletionPercentage / 100)
        context.drawImage(progressBar, 0, 0, progressBarWidth, canvasHeight, 0, 0, progressBarWidth, canvasHeight)

        // Export the progress bar image as png
        return new AttachmentBuilder(await canvas.toBuffer(), { name: 'progress-bar.png'})
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
        const canvas = await Canvas.createCanvas(32, 32)
        const context = await canvas.getContext('2d')
    
        context.fillStyle = hexCode
        context.fillRect(0, 0, canvas.width, canvas.height)
    
        return new AttachmentBuilder(await canvas.toBuffer(), { name: 'color.png' })
    }
}

module.exports = ProfileService
