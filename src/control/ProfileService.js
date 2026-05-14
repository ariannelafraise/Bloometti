const Canvas = require("canvas");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

const ChattingService = require("./ChattingService");

class ProfileService {
    async generateProfile(user, avatarUrl) {
        const attachment = await this.generateProgressBar(user, 1000, 25);

        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setAuthor({ name: `${user.username}`, iconURL: avatarUrl })
            .addFields({
                name: `Level ${user.chatting.level}`,
                value: `${user.chatting.expTowardsNextLevel} / ${ChattingService.calculateExpNeededToLevelUp(user.chatting.level)}`,
                inline: true,
            })
            .setImage("attachment://progress-bar.png");

        return { embed, attachment };
    }

    async generateProgressBar(user, w, h) {
        // Setup canvas
        const canvas = await Canvas.createCanvas(w, h);
        const context = await canvas.getContext("2d");

        // Fill the background
        const background = await Canvas.loadImage(
            "../public/progressBarBackground.jpg",
        );
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Calculate the progress percentage
        const levelCompletionPercentage = Math.floor(
            (user.chatting.expTowardsNextLevel /
                ChattingService.calculateExpNeededToLevelUp(
                    user.chatting.level,
                )) *
                100,
        );

        // Fill the progress bar
        context.fillStyle = user.color;
        context.fillRect(0, 0, canvas.width * (levelCompletionPercentage / 100), canvas.height);

        // Export the progress bar image as png
        return new AttachmentBuilder(await canvas.toBuffer(), {
            name: "progress-bar.png",
        });
    }

    async generateSetColor(hexCode) {
        const attachment = await this.generateColorSquare(hexCode);

        const embed = new EmbedBuilder()
            .setColor(hexCode)
            .setTitle(`Color set to: ${hexCode.toUpperCase()}`)
            .setImage("attachment://color.png");

        return { embed, attachment };
    }

    async generateColorSquare(hexCode) {
        const canvas = await Canvas.createCanvas(32, 32);
        const context = await canvas.getContext("2d");

        context.fillStyle = hexCode;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return new AttachmentBuilder(await canvas.toBuffer(), {
            name: "color.png",
        });
    }
}

module.exports = ProfileService;
