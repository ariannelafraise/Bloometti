const fs = require('fs')

class CommandDao {
    static #instance = null

    constructor() {
        if (CommandDao.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        CommandDao.#instance = this
    }

    static getInstance() {
        if (!CommandDao.#instance)
            CommandDao.#instance = new CommandDao()
        return CommandDao.#instance
    }

    getCommands() {
        const commands = []
        fs.readdirSync('commands')
            .filter(file => file.endsWith('Command.js'))
            .forEach(commandFile => {
                try {
                    const CommandClass = require(`../commands/${commandFile}`)
                    const command = new CommandClass()
                    commands.push(command)
                } catch (e) {
                    console.error(e)
                    throw e
                }
            })
        return commands
    }
}

module.exports = CommandDao
