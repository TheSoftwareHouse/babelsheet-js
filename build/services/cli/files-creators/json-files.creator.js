"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'json';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename) {
        if (typeof dataToSave === 'string') {
            this.fileRepository.saveData(dataToSave, filename, this.supportedExtension, path);
            return;
        }
        dataToSave.forEach((data) => {
            this.fileRepository.saveData(data.content, data.lang, this.supportedExtension, path);
        });
    }
}
exports.default = JsonFilesCreator;
