"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodepath = require("path");
class FakeFilesCreators {
    constructor(innerFilesCreators, basePath) {
        this.innerFilesCreators = innerFilesCreators;
        this.basePath = basePath;
    }
    save(dataToSave, path, filename, extension, version, baseLang) {
        return this.innerFilesCreators.save(dataToSave, nodepath.join(this.basePath, path), filename, extension, version, baseLang);
    }
}
exports.default = FakeFilesCreators;
