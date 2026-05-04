const { MongoClient } = require("mongodb");

const { url: URL, db: DB } = require("../config/mongo.json");

class MongoDbConnection {
    dbo;
    client;
    #loggingService;

    constructor(loggingService) {
        this.#loggingService = loggingService;
    }

    connect() {
        const log = "MongoDB: Connection established.";
        this.client = new MongoClient(URL);
        this.client.connect();
        console.log(log);
        this.#loggingService.log("Database", log);
        this.dbo = this.client.db(DB);
    }

    disconnect() {
        if (!this.client) return;

        try {
            this.client.close();
        } catch (e) {
            // ignore
        }
    }
}

module.exports = MongoDbConnection;
