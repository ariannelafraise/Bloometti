class EventService {
    #eventDao;

    constructor(eventDao) {
        this.#eventDao = eventDao;
    }

    loadEvents(client, context) {
        this.#eventDao.getEvents(context).forEach((event) => {
            if (event.once) {
                client.once(event.name, (...args) =>
                    event.execute(...args, client),
                );
            } else {
                client.on(event.name, (...args) =>
                    event.execute(...args, client),
                );
            }
        });
    }
}

module.exports = EventService;
