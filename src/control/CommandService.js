const CommandDao = require('../dao/CommandDao')

class CommandService {
    static #instance = null
    #commandDao
    #commands

    constructor() {
        if (CommandService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        CommandService.#instance = this
        this.#commandDao = CommandDao.getInstance()
        this.#commands = new Map()
    }

    static getInstance() {
        if (!CommandService.#instance)
            CommandService.#instance = new CommandService()
        return CommandService.#instance
    }

    loadCommands() {
        this.#commandDao.getCommands().forEach(command => {
            this.#commands.set(command.data.name, command)
        })
    }

    async executeCommand(commandName, interaction, client) {
        const command = this.#commands.get(commandName)

        if (!command) return

        try {
            command.execute(interaction, client)
        } catch (error) {
            console.error(error)
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }
}

module.exports = CommandService
