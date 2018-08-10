"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InEnvStorage {
    constructor() {
        this.data = {};
    }
    async set(key, value) {
        this.data[key] = value;
        return Promise.resolve();
    }
    async get(key) {
        if (this.data[key]) {
            return Promise.resolve(this.tryParse(this.data[key]));
        }
        return Promise.resolve(this.tryParse(process.env[key]));
    }
    async has(key) {
        return Promise.resolve(Boolean(await this.get(key)));
    }
    async clear() {
        this.data = {};
        return Promise.resolve();
    }
    tryParse(value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    }
}
exports.default = InEnvStorage;
