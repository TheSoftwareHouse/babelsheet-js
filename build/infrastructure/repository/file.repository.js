"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const file_repository_types_1 = require("./file-repository.types");
class FileRepository {
    hasAccess(path, permission) {
        try {
            fs.accessSync(path, permission === file_repository_types_1.Permission.Read ? fs.constants.R_OK : fs.constants.W_OK);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    loadData(filename, extension) {
        const fileName = `${filename}.${extension}`;
        if (fs.existsSync(fileName)) {
            return fs.readFileSync(fileName, 'utf8');
        }
        return null;
    }
    saveData(data, filename, extension, path = '.') {
        fs.writeFileSync(`${path}/${filename}.${extension}`, data);
    }
}
exports.default = FileRepository;
