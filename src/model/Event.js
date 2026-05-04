class Event {
    name;
    once;
    context;

    constructor(name, context, once = false) {
        this.name = name;
        this.once = once;
        this.context = context;
    }

    async execute(interaction, client) {
        throw new Error("Not implemented");
    }
}

module.exports = Event;
