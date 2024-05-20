const Event = require('../model/Event')

const UserService = require('../control/UserService')

class ReadyEvent extends Event {

    constructor() {
        super('ready', true)
    }

    async execute(client) {
        console.log(`Logged in as ${client.user.tag}\n\nGuilds:`)
        console.log(client.guilds.cache.map((guild) => guild.name).join('\n'))
    }
}

module.exports = ReadyEvent
