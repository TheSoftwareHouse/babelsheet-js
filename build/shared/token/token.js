"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenStorage {
    constructor(storage) {
        this.storage = storage;
    }
    async setToken(token) {
        this.storage.set('token', token);
    }
    async getToken() {
        return this.storage.get('token');
    }
}
exports.default = TokenStorage;
