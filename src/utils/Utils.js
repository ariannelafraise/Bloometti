class Utils {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static timeSinceEpoch() {
        return Math.round(Date.now() / 1000);
    }

    static clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
}

module.exports = Utils;
