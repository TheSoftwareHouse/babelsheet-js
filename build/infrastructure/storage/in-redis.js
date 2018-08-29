"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const util = require("util");
class InRedisStorage {
    constructor() {
        this.client = redis_1.createClient(Number(process.env.REDIS_PORT) || 6379, process.env.REDIS_HOST || 'db');
    }
    async set(key, value) {
        return util.promisify(this.client.set).bind(this.client)(key, JSON.stringify(value));
    }
    async get(key) {
        return JSON.parse(await util.promisify(this.client.get).bind(this.client)(key));
    }
    async has(key) {
        return util.promisify(this.client.exists).bind(this.client)(key);
    }
    async clear() {
        return util.promisify(this.client.flushall).bind(this.client)();
    }
}
exports.default = InRedisStorage;
