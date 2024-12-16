const { Client, GatewayIntentBits, Partials } = require('discord.js')

const CommandService = require('./control/CommandService')
const EventService = require('./control/EventService')
const { token } = require('./config/config.json')

const client = new Client({ 
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
    partials: [Partials.Channel]
})

CommandService.getInstance().loadCommands()
EventService.getInstance().loadEvents(client)

client.login(token)