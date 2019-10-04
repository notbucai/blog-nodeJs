const Redis = require("ioredis");

class RedisStore {
    constructor() {
        this.redis = new Redis();
    }

    async get(key) {
        let data = await this.redis.get(key);
        return JSON.parse(data);
    }

    async set(key, data, { maxAge = 24 * 60 * 60 * 1000 } = {}) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(key, JSON.stringify(data), 'EX', maxAge / 1000);
        } catch (e) { }
        return key;
    }

    async destroy(key) {
        return await this.redis.del(key);
    }
}

module.exports = () => {
    const store = new RedisStore();
    return async (ctx, next) => {
        ctx.redis = store;
        await next();
    }
};