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
        if (typeof dataToSave === 'string') {
            this.createFolderAndSave(dataToSave, path, filename);
            return;
        }
        const dataWithoutTags = dataToSave.filter((translations) => translations.lang !== 'tags');
        dataWithoutTags.forEach((data) => this.createFolderAndSave(data.content, path, `messages.${data.lang}`));
    }
    createFolderAndSave(data, folderName, fileName) {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
    }
}
exports.default = YamlFilesCreator;
