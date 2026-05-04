const fs = require("fs");

class CommandDao {
    getCommands(context) {
        const commands = [];
        fs.readdirSync("commands")
            .filter((file) => file.endsWith("Command.js"))
            .forEach((commandFile) => {
                const CommandClass = require(`../commands/${commandFile}`);
                const command = new CommandClass(context);
                commands.push(command);
            });
        return commands;
    }
}

module.exports = CommandDao;
