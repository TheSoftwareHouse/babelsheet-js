"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class AndroidFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'xml';
        this.defaultFileName = 'strings';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename, baseLang) {
        if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
            this.createFolderAndSave(dataToSave.result.merged, path, filename);
            return;
        }
        if (dataToSave.meta && dataToSave.meta.langCode) {
            this.createFolderAndSave(dataToSave.result.find((element) => element.lang === dataToSave.meta.langCode).content, path, filename);
            return;
        }
        dataToSave.result.forEach((data) => {
            const langWithLocale = this.transformLangWithRegion(data.lang);
            const folderName = `${path}/values-${langWithLocale}`;
            this.createFolderAndSave(data.content, folderName);
        });
        this.generateBaseTranslations(dataToSave.result, path, baseLang);
    }
    transformLangWithRegion(languageCode) {
        const langWithLocale = languageCode.split(/[-_]{1}/);
        if (langWithLocale.length > 1) {
            if (langWithLocale[0].toLocaleLowerCase() === langWithLocale[1].toLocaleLowerCase()) {
                return langWithLocale[0].toLowerCase();
            }
            return langWithLocale.join('-r');
        }
        return languageCode;
    }
    createFolderAndSave(data, folderName, filename) {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        this.fileRepository.saveData(data, filename || this.defaultFileName, this.supportedExtension, folderName);
    }
    generateBaseTranslations(dataToSave, path, baseLang) {
        const baseTranslations = dataToSave.find((translation) => translation.lang.toLowerCase().indexOf(baseLang.toLowerCase()) !== -1);
        if (baseTranslations) {
            const folderName = `${path}/values`;
            this.createFolderAndSave(baseTranslations.content, folderName);
        }
    }
}
exports.default = AndroidFilesCreator;
