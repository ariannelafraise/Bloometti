const axios = require("axios");

const { logsWebhookUrl } = require("../config/config.json");

class LoggingService {
    log(type, content) {
        const embed = {
            title: type,
            description: content,
            color: 16735741,
            author: {
                name: "Bloometti",
                url: "https://arianne.paintilya.dev/projects/bloometti",
                icon_url:
                    "https://cdn.discordapp.com/avatars/486158492026142725/62ad48ab3aa70d249e6c02eb7cda16c7.webp?size=96",
            },
        };

        axios.post(
            logsWebhookUrl,
            { embeds: [embed] },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}

module.exports = LoggingService;
