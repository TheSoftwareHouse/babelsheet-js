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
    save(dataToSave, path, filename) {
        if (typeof dataToSave === 'string') {
            this.fileRepository.saveData(dataToSave, filename, this.supportedExtension, path);
            return;
        }
        const dataWithoutTags = dataToSave.filter((translations) => translations.lang !== 'tags');
        dataWithoutTags.forEach((data) => {
            const langWithLocale = this.transformLangWithRegion(data.lang);
            const folderName = `${path}/values-${langWithLocale}`;
            fs.mkdirSync(folderName);
            this.fileRepository.saveData(data.content, this.defaultFileName, this.supportedExtension, folderName);
        });
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
}
exports.default = AndroidFilesCreator;
