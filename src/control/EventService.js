const EventDao = require('../dao/EventDao')

class EventService {
    static #instance = null
    #eventDao

    constructor() {
        if (EventService.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        EventService.#instance = this
        this.#eventDao = EventDao.getInstance()
    }

    static getInstance() {
        if (!EventService.#instance)
            EventService.#instance = new EventService()
        return EventService.#instance
    }

    loadEvents(client) {
        this.#eventDao.getEvents().forEach(event => {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client))
            }
            else {
                client.on(event.name, (...args) => event.execute(...args, client))
            }  
        })
    }
}

module.exports = EventService
