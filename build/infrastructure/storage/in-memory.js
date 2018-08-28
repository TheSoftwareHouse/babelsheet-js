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
        return this.data[key];
    }
    async has(key) {
        return Boolean(this.data[key]);
    }
    async getData() {
        return this.data;
    }
    async clear() {
        this.data = {};
    }
}
exports.default = InMemoryStorage;
