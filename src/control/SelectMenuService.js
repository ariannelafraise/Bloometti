class SelectMenuService {
    #selectMenuDao;
    #selectMenus;

    constructor(selectMenuDao) {
        this.#selectMenuDao = selectMenuDao;
        this.#selectMenus = new Map();
    }

    loadselectMenus(context) {
        this.#selectMenuDao.getselectMenus(context).forEach((selectMenu) => {
            this.#selectMenus.set(selectMenu.data.name, selectMenu);
        });
    }

    async executeselectMenu(selectMenuName, interaction, client) {
        const selectMenu = this.#selectMenus.get(selectMenuName);

        if (!selectMenu) return;

        selectMenu.execute(interaction, client);
    }
}

module.exports = SelectMenuService;
