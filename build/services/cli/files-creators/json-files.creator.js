"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const get_version_suffix_1 = require("../../../shared/get-version-suffix");
class JsonFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'json';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename, version) {
        if (typeof dataToSave === 'string') {
            this.createFolderAndSave(dataToSave, path, filename + get_version_suffix_1.toSuffix(version));
            return;
        }
        dataToSave.forEach((data) => {
            this.createFolderAndSave(data.content, path, data.lang + get_version_suffix_1.toSuffix(version));
        });
    }
    createFolderAndSave(data, folderName, fileName) {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
    }
}
exports.default = JsonFilesCreator;
