const Event = require("../model/Event");

class ReadyEvent extends Event {
    constructor(context) {
        super("clientReady", context, true);
    }

    async execute(client) {
        const guildsList = client.guilds.cache
            .map((guild) => guild.name)
            .join("\n");
        const log = `Logged in as ${client.user.tag}\n\nGuilds:\n` + guildsList;
        console.log(log);
        this.context.loggingService.log("Startup", log);
    }
}

module.exports = ReadyEvent;
