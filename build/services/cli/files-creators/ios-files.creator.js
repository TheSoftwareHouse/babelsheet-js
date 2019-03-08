"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const get_version_suffix_1 = require("../../../shared/get-version-suffix");
class IosFilesCreator {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
        this.supportedExtension = 'strings';
        this.defaultFileName = 'Localizable';
    }
    supports(extension) {
        return extension.toLowerCase() === this.supportedExtension;
    }
    save(dataToSave, path, filename, version, baseLang) {
        if (typeof dataToSave === 'string') {
            this.createFolderAndSave(dataToSave, path, filename + get_version_suffix_1.toSuffix(version));
            return;
        }
        const dataWithoutTags = dataToSave.filter((translations) => translations.lang !== 'tags');
        dataWithoutTags.forEach((data) => {
            const langWithLocale = this.transformLangWithRegion(data.lang);
            const folderName = `${path}/${version}/${langWithLocale}.lproj`;
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
            return langWithLocale.join('-');
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
            const folderName = `${path}/${version}/Base.lproj`;
            this.createFolderAndSave(baseTranslations.content, folderName);
        }
    }
}
exports.default = IosFilesCreator;
