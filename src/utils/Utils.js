class Utils {
    static async randomInt(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        )
    }

    static async timeSinceEpoch() {
        return Math.round(Date.now() / 1000)
    }
}

module.exports = Utils
