const fs = require('fs')

class EventDao {
    static #instance = null

    constructor() {
        if (EventDao.#instance)
            throw new Error('Use getInstance() to get the single instance of this class.')

        EventDao.#instance = this
    }

    static getInstance() {
        if (!EventDao.#instance)
            EventDao.#instance = new EventDao()
        return EventDao.#instance
    }

    getEvents() {
        const events = []
        fs.readdirSync('events')
            .filter(file => file.endsWith('Event.js'))
            .forEach(eventFile => {
                try {
                    const EventClass = require(`../events/${eventFile}`)
                    const event = new EventClass()
                    events.push(event)
                } catch (e) {
                    console.error(e)
                    throw e
                }
            })
        return events
    }
}

module.exports = EventDao
