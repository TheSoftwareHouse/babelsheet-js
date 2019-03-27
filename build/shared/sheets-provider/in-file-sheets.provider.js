"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx = require("js-xlsx");
const lodash_1 = require("lodash");
const DELIMITER = ',';
const NEW_LINE = '\n';
class InFileSheetsProvider {
    async getSpreadsheetValues(config) {
        const { spreadsheetFilePath, spreadsheetName } = config;
        const fullSheet = xlsx.readFile(spreadsheetFilePath);
        const ranges = spreadsheetName ? [spreadsheetName] : fullSheet.SheetNames;
        return ranges.reduce((accumulator, sheetName) => {
            const sheetAsCsv = xlsx.utils.sheet_to_csv(fullSheet.Sheets[sheetName], { strip: true });
            if (!sheetAsCsv || sheetAsCsv.length === 0) {
                return accumulator;
            }
            accumulator[sheetName] = sheetAsCsv
                .split(NEW_LINE)
                .filter((row) => !this.isEmptyRow(row))
                .map((row) => lodash_1.trimEnd(row, DELIMITER))
                .map((row) => row.split(DELIMITER));
            return accumulator;
        }, {});
    }
    supports(type) {
        return type === 'in-file';
    }
    isEmptyRow(row) {
        return row.split(DELIMITER).length === row.length + 1;
    }
}
exports.default = InFileSheetsProvider;
