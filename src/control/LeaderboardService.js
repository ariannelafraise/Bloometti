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
      .setImage("attachment://Test.png");
    return { embed, attachment };

  }

  async generateBoard(users) {
    users.sort((a,b)=>a.chatting.level === b.chatting.level?b.chatting.exp-a.chatting.exp:b.chatting.level-a.chatting.level);
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
    context.font = "24px";
    context.fillStyle = textColor;
    context.fillText("Rank", 3, 25);
    context.fillText("Username", 100, 25);
    context.fillText("Level", 500, 25);
    context.fillText("EXP", 600, 25);

    let height;
    let bar;
    let lineGrad;
    for (const user of users) {
      const index = users.indexOf(user);
      height = 53+31*index;
      bar = await this.#profileService.generateProgressBar(user, 85, 10);
      bar = Buffer.from(bar.attachment,"binary").toString("base64");
      bar = await Canvas.loadImage("data:image/png;base64,"+bar);
      lineGrad = context.createLinearGradient(0, height-26, 698, height+15);
      lineGrad.addColorStop(0, user.color+ "A9");
      lineGrad.addColorStop(1, "transparent");
      context.fillStyle = lineGrad ;
      context.fillRect(2, height-24, 698, 31);
      context.fillStyle = textColor;
      context.fillText(index+1, 0, height);
      context.fillText(user.username, 102, height);
      context.fillText(user.chatting.level, 502, height);
      //context.fillText(user.chatting.exp, 602, height);
      context.drawImage(bar, 602, height-bar.height, bar.width, bar.height);
    }
    context.fillRect(0, 0, 2, 1000);
    context.fillRect(0, 0, 2, 1000);
    context.fillRect(90, 0, 2, 1000);
    context.fillRect(490, 0, 2, 1000);
    context.fillRect(590, 0, 2, 1000);
    context.fillRect(699, 0, 2, 1000);
    context.fillRect(0, 28, 700, 1);
    
    // Export the progress bar image as png
    return new AttachmentBuilder(await canvas.toBuffer(), {
        name: "Test.png",
    });
  }
}

module.exports = LeaderboardService;
