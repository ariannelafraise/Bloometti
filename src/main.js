const { Client, GatewayIntentBits, Partials } = require("discord.js");

const CommandService = require("./control/CommandService");
const EventService = require("./control/EventService");
const { token } = require("./config/config.json");
const MongoDbConnection = require("./dao/MongoDbConnection");
const UserDaoMongoDb = require("./dao/UserDaoMongoDb");
const CommandDao = require("./dao/CommandDao");
const EventDao = require("./dao/EventDao");
const UserService = require("./control/UserService");
const ChattingService = require("./control/ChattingService");
const LoggingService = require("./control/LoggingService");
const ProfileService = require("./control/ProfileService");
const LeaderboardService = require("./control/LeaderboardService")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
});

const loggingService = new LoggingService();

const db = new MongoDbConnection(loggingService);
db.connect();

const userDao = new UserDaoMongoDb(db);
const commandDao = new CommandDao();
const eventDao = new EventDao();

const userService = new UserService(userDao, loggingService);
const chattingService = new ChattingService(userService);
const profileService = new ProfileService();

const commandService = new CommandService(commandDao);
const eventService = new EventService(eventDao);
const leaderboardService = new LeaderboardService()

const context = {
    db: db,
    userService: userService,
    chattingService: chattingService,
    profileService: profileService,
    loggingService: loggingService,
    commandService: commandService,
    leaderboardService: leaderboardService
};

commandService.loadCommands(context);
eventService.loadEvents(client, context);

try {
    client.login(token);
} catch (e) {
    console.error(e);
    db.disconnect();
}
