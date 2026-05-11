const Canvas = require("canvas");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

const ChattingService = require("./ChattingService");

class LeaderboardService {
  async generateLeaderboard(user, users){
        const attachment = await this.generateBoard(users);
        const embed = new EmbedBuilder()
            .setColor(user.color)
            .setTitle("Leaderboard")
            .setImage("attachment://Test.png");
        return { embed, attachment };

  }

  async generateBoard(users) {
    users.sort((a,b)=>a.chatting.level === b.chatting.level?b.chatting.exp-a.chatting.exp:b.chatting.level-a.chatting.level)
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
    users.forEach((user, index) => {
      let rank = index+1;
      let height = 53+31*index
      let lineGrad = context.createLinearGradient(0, height-26, 698, height+15);
      lineGrad.addColorStop(0, user.color+ "A9");
      lineGrad.addColorStop(1, "transparent");
      context.fillStyle = lineGrad ;
      context.fillRect(2, height-24, 698, 31);
      context.fillStyle = textColor;
      context.fillText(index+1, 0, height);
      context.fillText(user.username, 102, height);
      context.fillText(user.chatting.level, 502, height);
      context.fillText(user.chatting.exp, 602, height);
    });
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
