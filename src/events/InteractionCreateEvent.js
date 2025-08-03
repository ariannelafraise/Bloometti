const CommandService = require('../control/CommandService')
const LoggingService = require('../control/LoggingService')

const Event = require('../model/Event')

class InteractionCreateEvent extends Event {
    constructor() {
        super('interactionCreate')
    }

    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const log = `Command '${interaction.commandName}' executed by ${interaction.user.username}.`
            console.log(log)
            LoggingService.getInstance().log('Commands', log)
            CommandService.getInstance().executeCommand(interaction.commandName, interaction, client)
        }
    }
}

module.exports = InteractionCreateEvent
