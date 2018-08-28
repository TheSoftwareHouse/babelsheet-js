"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenProvider {
    constructor(writeProvider, readProviders) {
        this.writeProvider = writeProvider;
        this.readProviders = readProviders;
        this.currentReadProvider = null;
    }
    async setToken(value) {
        this.writeProvider.set('token', value);
    }
    async getToken() {
        if (this.currentReadProvider) {
            return this.currentReadProvider.get('token');
        }
        for (const readProvider of this.readProviders) {
            const value = await readProvider.get('token');
            if (value) {
                this.currentReadProvider = readProvider;
                return value;
            }
        }
        return null;
    }
}
exports.default = TokenProvider;
