"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FilesCreators {
    constructor(filesCreators) {
        this.filesCreators = filesCreators;
    }
    save(dataToSave, path, filename, extension, version, baseLang) {
        const fileCreator = this.filesCreators.find(creator => creator.supports(extension));
        if (!fileCreator) {
            throw new Error(`No support for saving ${extension} data type`);
        }
        return fileCreator.save(dataToSave, path, filename, version, baseLang);
    }
}
exports.default = FilesCreators;
