"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
class PoFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'po';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename) {
        if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
            this.createFolderAndSave(dataToSave.result.merged, path, filename);
            return;
        }
        if (dataToSave.meta && dataToSave.meta.langCode) {
            this.createFolderAndSave(dataToSave.result.find((element) => element.lang === dataToSave.meta.langCode).content, path, filename);
            return;
        }
        dataToSave.result.forEach((data) => this.createFolderAndSave(data.content, path, `plugin-${data.lang}`));
    }
    createFolderAndSave(data, folderName, fileName) {
        if (!fs.existsSync(folderName)) {
            fs.mkdirsSync(folderName);
        }
        this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
    }
}
exports.default = PoFilesCreator;
