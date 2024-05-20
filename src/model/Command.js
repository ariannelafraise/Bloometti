class Command {
    constructor(data) {
        this.data = data
    }

    async execute(interaction, client) {
        throw new Error('Not implemented')
    }
}

module.exports = Command
