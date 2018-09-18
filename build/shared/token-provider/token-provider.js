"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenProvider {
    constructor(writeProvider, readProviders) {
        this.writeProvider = writeProvider;
        this.readProviders = readProviders;
        this.currentReadProvider = null;
    }
    async setRefreshToken(value) {
        this.writeProvider.set('refresh_token', value);
    }
    async getRefreshToken() {
        if (this.currentReadProvider) {
            return this.currentReadProvider.get('babelsheet_refresh_token');
        }
        for (const readProvider of this.readProviders) {
            const value = await readProvider.get('babelsheet_refresh_token');
            if (value) {
                this.currentReadProvider = readProvider;
                return value;
            }
        }
        return null;
    }
}
exports.default = TokenProvider;
