const Event = require("../model/Event");

class InteractionCreateEvent extends Event {
    constructor(context) {
        super("interactionCreate", context);
    }

    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const log = `Command '${interaction.commandName}' executed by ${interaction.user.username}.`;
            console.log(log);
            this.context.loggingService.log("Commands", log);
            this.context.commandService.executeCommand(
                interaction.commandName,
                interaction,
                client,
            );
        }
    }
}

module.exports = InteractionCreateEvent;
