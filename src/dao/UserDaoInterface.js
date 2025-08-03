class UserDaoInterface {
    async findAll() {
        throw new Error('Method not implemented')
    }

    async findById(discordId) {
        throw new Error('Method not implemented')
    }

    async new(user) {
        throw new Error('Method not implemented')
    }

    async updateById(discordId, property, value) {
        throw new Error('Method not implemented')
    }
}

module.exports = UserDaoInterface
