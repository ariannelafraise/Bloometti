const CommandService = require('../control/CommandService')

const Event = require('../model/Event')

class InteractionCreateEvent extends Event {
    constructor() {
        super('interactionCreate')
    }

    async execute(interaction, client) {
        if (interaction.isCommand()) {
            console.log(`Command ${interaction.commandName} executed by ${interaction.user.username}.`)
            CommandService.getInstance().executeCommand(interaction.commandName, interaction, client)
        }
    }
}

module.exports = InteractionCreateEvent
