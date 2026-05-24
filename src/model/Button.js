class Button {
    data;
    context;

    constructor(data, context) {
        this.data = data;
        this.context = context;
    }

    async execute(interaction, client) {
        throw new Error("Not implemented");
    }
}

module.exports = Button;
