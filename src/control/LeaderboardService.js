const Canvas = require("canvas");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { Buffer } = require("node:buffer");

const ProfileService = require("./ProfileService");

class LeaderboardService {
  #profileService;

  constructor(profileService) {
    this.#profileService = profileService;
  }

  async generateLeaderboard(user, users){
    const attachment = await this.generateBoard(users);
    const embed = new EmbedBuilder()
      .setColor(user.color)
      .setTitle("Leaderboard [TOP 10]")
      .setImage("attachment://leaderboard.png");
    return { embed, attachment };

  }

  async generateBoard(users) {
    users.sort(this.rankUsers);
    if (users.length > 10){
      users = users.slice(0, 10);
    }
    // Setup canvas
    const canvas = await Canvas.createCanvas(700, 53+31*users.length);
    const context = await canvas.getContext("2d");
    // Background color
    context.fillStyle = "#1e1e2e";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Text and lines
    const textColor = "#cdd6f4";
    this.drawTable(context, textColor, canvas.width, canvas.height);
    // Raws
    await this.drawRaws(context, textColor, users);
    // Export the progress bar image as png
    return new AttachmentBuilder(await canvas.toBuffer(), {
        name: "leaderboard.png",
    });
  }

  rankUsers(userA, userB){
    if (userA.chatting.level === userB.chatting.level) {
      return userB.chatting.exp-userA.chatting.exp;
    }
    return userB.chatting.level-userA.chatting.level;
  }

  drawTable(ctx, color, width, height){
    ctx.font = "24px";
    ctx.fillStyle = color;
    // Tiltes
    ctx.fillText("Rank", 10, 25);
    ctx.fillText("Username", 100, 25);
    ctx.fillText("Level", 500, 25);
    ctx.fillText("EXP", 600, 25);
    // Lines
    ctx.fillRect(0, 0, 2, height);
    ctx.fillRect(90, 0, 2, height);
    ctx.fillRect(490, 0, 2, height);
    ctx.fillRect(590, 0, 2, height);
    ctx.fillRect(698, 0, 2, height);
    ctx.fillRect(0, 28, width, 2);
  }

  async drawRaws(ctx, txtColor, usrs){
    // Init variables (optimization)
    let usr;
    let height;
    let lineGrad;
    let bar;
    // For all users
    for (let index in usrs) {
      index = parseInt(index);
      usr = usrs[index];
      height = 53+31*index;
      // Draw raw background as a gradient
      lineGrad = ctx.createLinearGradient(0, height-26, 698, height+15);
      lineGrad.addColorStop(0, usr.color+ "A9");
      lineGrad.addColorStop(1, "transparent");
      ctx.fillStyle = lineGrad ;
      ctx.fillRect(2, height-24, 698, 31);
      // Write user informations
      ctx.fillStyle = txtColor;
      ctx.fillText(index+1, 10, height); // Rank
      ctx.fillText(usr.username, 100, height); // Username
      ctx.fillText(usr.chatting.level, 500, height); // Level
      // Draw progress bar
      bar = await this.getUserProgressBar(usr);
      ctx.drawImage(bar, 600, height-(bar.height+2), bar.width, bar.height);
    }
  }

  async getUserProgressBar(usr){
    // Get user progress bar as a buffer
    const progressBar = await this.#profileService.generateProgressBar(usr, 88, 10);
    // Convert into base64
    const pbBase64 = Buffer.from(progressBar.attachment,"binary").toString("base64");
    // Load as canvas image
    return await Canvas.loadImage("data:image/png;base64,"+pbBase64);
  }
}

module.exports = LeaderboardService;
