class Event {
    constructor(name, once = false) {
        this.name = name
        this.once = once
    }

    async execute(interaction, client) {
        throw new Error('Not implemented')
    }
}

module.exports = Event
