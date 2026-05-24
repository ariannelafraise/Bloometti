const fs = require("fs");

class ButtonDao {
    getButtons(context) {
        const buttons = [];
        fs.readdirSync("buttons")
            .filter((file) => file.endsWith("Button.js"))
            .forEach((buttonFile) => {
                const ButtonClass = require(`../buttons/${buttonFile}`);
                const button = new ButtonClass(context);
                buttons.push(button);
            });
        return buttons;
    }
}

module.exports = ButtonDao;
