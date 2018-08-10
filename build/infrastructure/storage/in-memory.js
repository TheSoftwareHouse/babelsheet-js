"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryStorage {
    constructor() {
        this.data = {};
    }
    async set(key, value) {
        this.data[key] = value;
        return Promise.resolve();
    }
    async get(key) {
        return Promise.resolve(this.data[key]);
    }
    async has(key) {
        return Promise.resolve(Boolean(this.data[key]));
    }
    async getData() {
        return Promise.resolve(this.data);
    }
    async clear() {
        this.data = {};
        return Promise.resolve();
    }
}
exports.default = InMemoryStorage;
