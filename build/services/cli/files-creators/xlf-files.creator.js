"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const get_version_suffix_1 = require("../../../shared/get-version-suffix");
class XlfFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'xlf';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename, version) {
        if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
            this.createFolderAndSave(dataToSave.result.merged, path, filename);
            return;
        }
        if (dataToSave.meta && dataToSave.meta.langCode) {
            this.createFolderAndSave(dataToSave.result.find((element) => element.lang === dataToSave.meta.langCode).content, path, filename + get_version_suffix_1.toSuffix(version));
            return;
        }
        dataToSave.result.forEach((data) => this.createFolderAndSave(data.content, path, `messages.${data.lang}${get_version_suffix_1.toSuffix(version)}`));
    }
    createFolderAndSave(data, folderName, fileName) {
        if (!fs.existsSync(folderName)) {
            fs.mkdirsSync(folderName);
        }
        this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
    }
}
exports.default = XlfFilesCreator;
