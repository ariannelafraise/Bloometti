const { logsWebhookUrl } = require('../config/config.json')
const axios = require('axios')

class LoggingService {
    static #instance

    constructor() {
        if (LoggingService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        LoggingService.#instance = this
    }

    static getInstance() {
        if (!LoggingService.#instance)
            LoggingService.#instance = new LoggingService()
        return LoggingService.#instance
    }

    log(type, content) {
        const embed = {
            "title": type,
            "description": content,
            "color": 16735741,
            "author": {
                "name": "Bloometti",
                "url": "https://arianne.paintilya.dev/projects/bloometti",
                "icon_url": "https://cdn.discordapp.com/avatars/486158492026142725/62ad48ab3aa70d249e6c02eb7cda16c7.webp?size=96"
            }
        }

        axios.post(
            logsWebhookUrl,
            { embeds : [embed] },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }
}

module.exports = LoggingService
