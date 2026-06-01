const fs = require("fs");

class SelectMenuDao {
    getSelectMenus(context) {
        const selectMenus = [];
        fs.readdirSync("selectMenus")
            .filter((file) => file.endsWith("SelectMenu.js"))
            .forEach((SelectMenuFile) => {
                const selectMenuClass = require(`../selectMenus/${SelectMenuFile}`);
                const selectMenu = new selectMenuClass(context);
                selectMenus.push(selectMenu);
            });
        return selectMenus;
    }
}

module.exports = SelectMenuDao;
