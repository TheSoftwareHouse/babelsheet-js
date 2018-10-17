"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class YamlFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'yml';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename) {
        if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
            this.createFolderAndSave(dataToSave.result.merged, path, filename);
            return;
        }
        dataToSave.result.forEach((data) => this.createFolderAndSave(data.content, path, `messages.${data.lang}`));
    }
    createFolderAndSave(data, folderName, fileName) {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
    }
}
exports.default = YamlFilesCreator;
