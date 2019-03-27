"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SheetsProviderFactory {
    constructor(providers) {
        this.providers = providers;
    }
    getProviderFor(type) {
        const providerForType = this.providers.filter(provider => provider.supports(type));
        if (providerForType.length === 0) {
            throw new Error(`No sheets provider for type ${type}.`);
        }
        return providerForType[0];
    }
}
exports.SheetsProviderFactory = SheetsProviderFactory;
