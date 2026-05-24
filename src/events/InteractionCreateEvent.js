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
        } else if (interaction.isButton()) {
            const log = `Button '${interaction.customId}' called by ${interaction.user.username}.`;
            console.log(log);
            this.context.loggingService.log("Buttons", log);
            let button;
            //// This section is specific to paging
            if (interaction.customId.startsWith("changePage")) {
                button = "changePage";
            } else {
                button = interaction.customId;
            }
            this.context.buttonService.executebutton(
                button,
                interaction,
                client,
            );
        }
    }
}

module.exports = InteractionCreateEvent;
