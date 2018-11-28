// if snapshots changed intentionally, remove the whole snaps folder

import createContainer from '../container';
import FakeGoogleSheets from '../../../tests/fakeSheets';
import * as awilix from 'awilix';
import { spreadsheetData } from '../../../tests/testData';
import Interpreter from './interpreter';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as jsdiff from 'diff';
import * as dircompare from 'dir-compare';
import FilesCreators from '../files-creators/files-creators';
import FakeFilesCreators from '../../../tests/fakeFileCreators';
import { getLoggerMock } from '../../../tests/loggerMock';

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
const isUnixHiddenPath = path => {
  return /(^|\/)\.[^\/\.]/g.test(path);
};
const reset = '\x1b[0m';
const green = '\x1b[32m';
const red = '\x1b[31m';
const getColor = difference => {
  if (difference.added) {
    return green;
  } else if (difference.removed) {
    return red;
  } else {
    return reset;
  }
};

const loggerMock = getLoggerMock();
const containerTemp = createContainer();
const fileCreators = containerTemp.resolve<FilesCreators>('filesCreators');

const container = containerTemp.register({
  googleSheets: awilix
    .asClass(FakeGoogleSheets)
    .inject(() => ({ returnData: spreadsheetData.multiRawSpreadsheetData })),
  logger: awilix.asValue(loggerMock),
});
const snapsPath = path.join('src', 'services', 'cli', 'interpreter', 'tests');
const supportedFormats = ['yml', 'android', 'ios', 'json', 'xlf', 'po'];

// get directories list in /tests
const directories = fs.readdirSync(snapsPath);

const scenarios = directories.reduce((accumulator, directory) => {
  // skip directory if hidden
  if (isUnixHiddenPath(directory)) {
    return accumulator;
  }
  // check if there is a desc.json file in the directory
  const descFilePath = path.join(snapsPath, directory, 'desc.json');
  const descFileExists = fs.existsSync(descFilePath);
  if (!descFileExists) {
    return accumulator;
  }
  // read the desc file
  const desc = JSON.parse(fs.readFileSync(descFilePath, 'utf8'));
  // add scenario
  return [
    ...accumulator,
    {
      description: desc.description,
      params: desc.params,
      format: desc.format,
      resultPath: path.join(snapsPath, directory, 'result'),
      snapPath: path.join(snapsPath, directory, 'snap'),
    },
  ];
}, []);

describe('CLI interpreter', () => {
  beforeAll(() => {
    process.env.BABELSHEET_CLIENT_ID = 'BABELSHEET_CLIENT_ID';
    process.env.BABELSHEET_CLIENT_SECRET = 'BABELSHEET_CLIENT_SECRET';
    process.env.BABELSHEET_SPREADSHEET_NAME = 'BABELSHEET_SPREADSHEET_NAME';
    process.env.BABELSHEET_SPREADSHEET_ID = 'BABELSHEET_SPREADSHEET_ID';
    process.env.BABELSHEET_REDIRECT_URI = 'BABELSHEET_REDIRECT_URI';
  });
  afterAll(() => {
    // remove all results
    scenarios.forEach(scenario => {
      fs.removeSync(scenario.resultPath);
      fs.mkdirsSync(scenario.resultPath);
    });
  });
  // for each scenario
  scenarios.forEach(scenario => {
    it(scenario.description, async done => {
      await asyncForEach(scenario.format ? [scenario.format] : supportedFormats, async format => {
        const resultPathWithFormat = path.join(scenario.resultPath, format);
        // alter arguments and paths
        container.register({
          shadowArgs: awilix.asValue(['generate', '-f', format, ...scenario.params]),
          filesCreators: awilix.asClass(FakeFilesCreators).inject(() => ({
            innerFilesCreators: fileCreators,
            basePath: resultPathWithFormat,
          })),
        });
        // interpret arguments
        const interpreter = await container.resolve<Interpreter>('interpreter').interpret();
        // check if snap folder exists, create it if it doesent and copy test contents. Dont copy if the folder exists, in case of more files than expected being generated.
        const snapPathWithFormat = path.join(scenario.snapPath, format);
        const snapshotFolderExists = fs.existsSync(snapPathWithFormat);
        if (!snapshotFolderExists) {
          fs.mkdirsSync(snapPathWithFormat);
          fs.copySync(resultPathWithFormat, snapPathWithFormat);
        } else {
          const directoryDiff = await dircompare.compare(resultPathWithFormat, snapPathWithFormat, {
            compareContent: true,
          });

          // deepcompare different files
          const deepAnalysis = directoryDiff.diffSet.filter(element => element.state !== 'equal');
          deepAnalysis.forEach(difference => {
            // expect files to be in both directories
            expect(difference.path1).toBeDefined();
            expect(difference.name1).toBeDefined();
            expect(difference.path2).toBeDefined();
            expect(difference.name2).toBeDefined();

            const resultFilePath = path.join(difference.path1, difference.name1);
            const snapFilePath = path.join(difference.path2, difference.name2);
            const oldFile = fs.readFileSync(snapFilePath, 'utf8');
            const newFile = fs.readFileSync(resultFilePath, 'utf8');
            const diff = jsdiff.diffChars(oldFile, newFile);

            const colorOutput = diff.reduce((accumulator, current) => {
              return `${accumulator}${getColor(current)}${current.value}`;
            }, `${resultFilePath}:\n`);
            // print formatted diffs
            console.log(colorOutput, getColor({}));
            expect(deepAnalysis.length).toBe(0);
          });
        }
      });
      done();
    });
  });
});
