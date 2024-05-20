const fs = require('fs')
const { REST, Routes } = require('discord.js')
const { clientId, token } = require('../src/config/config.json')

const commands = []
fs.readdirSync('../src/commands')
    .filter(file => file.endsWith('Command.js'))
    .forEach(commandFile => {
        try {
            const CommandClass = require(`../src/commands/${commandFile}`)
            const command = new CommandClass()
            commands.push(command.data.toJSON())
        } catch (e) {
            console.error(e)
            throw e
        }
    })

const rest = new REST().setToken(token); // SEMICOLON NEEDED FOR SOME REASON

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error)
	}
})()
