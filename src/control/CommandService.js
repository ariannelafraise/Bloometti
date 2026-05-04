class CommandService {
    #commandDao;
    #commands;

    constructor(commandDao) {
        this.#commandDao = commandDao;
        this.#commands = new Map();
    }

    loadCommands(context) {
        this.#commandDao.getCommands(context).forEach((command) => {
            this.#commands.set(command.data.name, command);
        });
    }

    async executeCommand(commandName, interaction, client) {
        const command = this.#commands.get(commandName);

        if (!command) return;

        command.execute(interaction, client);
    }
}

module.exports = CommandService;
