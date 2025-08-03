const Event = require('../model/Event')
const LoggingService = require('../control/LoggingService')

class ReadyEvent extends Event {

    constructor() {
        super('ready', true)
    }

    async execute(client) {
        const guildsList = client.guilds.cache.map(guild => guild.name).join('\n')
        const log = `Logged in as ${client.user.tag}\n\nGuilds:\n` + guildsList
        console.log(log)
        LoggingService.getInstance().log('Startup', log)
    }
}

module.exports = ReadyEvent
