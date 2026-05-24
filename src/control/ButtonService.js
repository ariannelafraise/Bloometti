class ButtonService {
    #buttonDao;
    #buttons;

    constructor(buttonDao) {
        this.#buttonDao = buttonDao;
        this.#buttons = new Map();
    }

    loadbuttons(context) {
        this.#buttonDao.getbuttons(context).forEach((button) => {
            this.#buttons.set(button.data.name, button);
        });
    }

    async executebutton(buttonName, interaction, client) {
        const button = this.#buttons.get(buttonName);

        if (!button) return;

        button.execute(interaction, client);
    }
}

module.exports = ButtonService;
