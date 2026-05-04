const fs = require("fs");

class EventDao {
    getEvents(context) {
        const events = [];
        fs.readdirSync("events")
            .filter((file) => file.endsWith("Event.js"))
            .forEach((eventFile) => {
                try {
                    const EventClass = require(`../events/${eventFile}`);
                    const event = new EventClass(context);
                    events.push(event);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            });
        return events;
    }
}

module.exports = EventDao;
