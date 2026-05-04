const fs = require("fs");
const { REST, Routes } = require("discord.js");
const { clientId, token, guildId } = require("../src/config/config.json");
const MongoDbConnection = require("../src/dao/MongoDbConnection");

const commands = [];
fs.readdirSync("src/commands")
    .filter((file) => file.endsWith("Command.js"))
    .forEach((commandFile) => {
        try {
            const CommandClass = require(`../src/commands/${commandFile}`);
            const command = new CommandClass();
            commands.push(command.data.toJSON());
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(
            `Refreshing ${commands.length} application (/) commands...`,
        );

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commands,
            },
        );

        console.log(
            `Successfully refreshed ${data.length} application (/) commands.`,
        );
    } catch (error) {
        console.error(error);
    }
})();
