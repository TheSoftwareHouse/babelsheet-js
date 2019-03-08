"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const get_version_suffix_1 = require("../../../shared/get-version-suffix");
class AndroidFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'xml';
        this.defaultFileName = 'strings';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename, version, baseLang) {
        if (typeof dataToSave === 'string') {
            this.createFolderAndSave(dataToSave, path, filename + get_version_suffix_1.toSuffix(version));
            return;
        }
        const dataWithoutTags = dataToSave.filter((translation) => translation.lang !== 'tags');
        dataWithoutTags.forEach((data) => {
            const langWithLocale = this.transformLangWithRegion(data.lang);
            const folderName = `${path}/${version}/values-${langWithLocale}`;
            this.createFolderAndSave(data.content, folderName);
        });
        this.generateBaseTranslations(dataToSave, path, baseLang, version);
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
            fs.mkdirSync(folderName, { recursive: true });
        }
        this.fileRepository.saveData(data, filename || this.defaultFileName, this.supportedExtension, folderName);
    }
    generateBaseTranslations(dataToSave, path, baseLang, version) {
        const baseTranslations = dataToSave.find((translation) => translation.lang.toLowerCase().indexOf(baseLang.toLowerCase()) !== -1);
        if (baseTranslations) {
            const folderName = `${path}/${version}/values`;
            this.createFolderAndSave(baseTranslations.content, folderName);
        }
    }
}
exports.default = AndroidFilesCreator;
