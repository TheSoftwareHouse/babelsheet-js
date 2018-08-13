"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InFileStorage {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    async set(key, value) {
        this.saveData({ ...this.loadData(), [key]: value });
    }
    async get(key) {
        return this.loadData()[key];
    }
    async has(key) {
        return Boolean(await this.get(key));
    }
    async clear() {
        this.saveData({});
    }
    loadData() {
        const data = this.fileRepository.loadData('data', 'json');
        return data ? JSON.parse(data) : {};
    }
    saveData(data) {
        this.fileRepository.saveData(JSON.stringify(data), 'data', 'json');
    }
}
exports.default = InFileStorage;
