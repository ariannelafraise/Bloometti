![Bloometti logo](media/bloometti.png)
A Discord bot made with [Discord.js](https://discord.js.org/#/).

[Website](https://arianne.paintilya.dev/projects/bloometti)

## In action
![profile embed](media/in-action.png)

## Levels system
### Commands
#### /profile [user: @mention]
View your profile or the mentionned user's profile.
#### /ephemeral
Toggle ephemeral mode. This mode makes all your interactions with the bot hidden from other users.
#### /setcolor [hexcode*: #FFFFFF]
Set the color of your profile to a specific HEX code.

### Formula
experienceToNextLevel = (currentLevel * nextLevel) * 50

### Configuration
src/config/chatting.json
```json
{
    "chattingExpMultiplier": 1.00,
    "chattingExpDelayInSeconds": 60,
    "chattingExpMinGain": 120,
    "chattingExpMaxGain": 300
}
```
src/config/defaults.json
```json
{
    "defaultColor": "#ff5dfd",
    "defaultEphemeral": false
}
```

## Setting up
Create `src/config/config.json`
```json
{
    "token": "YOUR_BOT_TOKEN",
    "logsWebhookUrl": "YOUR_LOGS_DISCORD_WEBHOOK",
    "clientId": "YOUR_BOT_CLIENT_ID",
    "guildId": "YOUR_BOT_GUILD_ID",
}
```

## Deployment
Deployed with Docker Compose:

*Check Dockerfile and docker-compose.yml.*

Here are the containers:
- The bot
- A local MongoDB database on port 27017
- [mongo-express](https://github.com/mongo-express/mongo-express) (web interface for MongoDB) on port 8081

### Start
```
$ sudo docker compose up
```

### Stop
```
$ sudo docker compose down
```

### Rebuilding
```
$ sudo docker compose down --rmi all
or 
$ sudo docker compose down
$ sudo docker image remove bloometti-bot

then
$ sudo docker compose up --build
```

## Backing up data
```
$ docker exec -it mongo bash
$ cd data/db
```
### Export/Import
**users.json will be located in `data/mongo` on the host system**
```
$ mongoexport --db bloometti --port 27017 --collection users --out=users.json
```
```
$ mongoimport --db bloometti --port 27017 --collection users --file users.json
```
