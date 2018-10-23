import createContainer from "../container";
import FakeGoogleSheets from "../../../tests/fakeSheets";
import * as awilix from 'awilix';
import { spreadsheetData } from '../../../tests/testData'
import Interpreter from "./interpreter";
import path from 'path';
// const fs = require('fs');
import * as fs from 'fs';


const container = createContainer().register({
    googleSheets: awilix.asClass(FakeGoogleSheets).inject(() => ({ returnData: spreadsheetData.multiRawSpreadsheetData })),
});
const snapsPath = './tests/snapshots/'
const scenarios = [
    {
        description: 'Creates basic jsons with no options',
        params: ['-f', 'json'],
        results: ['en_US.json', 'pl_PL.json'],
    }
]

describe('CLI interpreter', () => {
    beforeEach(async () => {
        process.env.BABELSHEET_CLIENT_ID = 'BABELSHEET_CLIENT_ID';
        process.env.BABELSHEET_CLIENT_SECRET = 'BABELSHEET_CLIENT_SECRET';
        process.env.BABELSHEET_SPREADSHEET_NAME = 'BABELSHEET_SPREADSHEET_NAME';
        process.env.BABELSHEET_SPREADSHEET_ID = 'BABELSHEET_SPREADSHEET_ID';
        process.env.BABELSHEET_REDIRECT_URI = 'BABELSHEET_REDIRECT_URI';
    });
    scenarios.forEach(scenario => {
        it(scenario.description, async () => {
            container.register({
                shadowArgs: awilix.asValue(['generate', ...scenario.params]),
            })
            const interpreter = await container.resolve<Interpreter>('interpreter').interpret();
            // check if result files exist
            scenario.results.forEach(result => {
                fs.access(result, fs.constants.F_OK, (err) => {
                    expect(err).toBeNull();
                    // check if results are in snapshots directory
                    fs.access(path.join(snapsPath, result), fs.constants.F_OK, (err) => {
                        // file doesen't exist - copy it
                        if (err) {
                            fs.copyFileSync(result, snapsPath)
                        }
                    });
                });
            })
        })
    })
})




// build .js files
// const fs = require('fs');
// const {
  // spawn
// } = require('child_process');
// (async ()=>{
  // const build = spawn('yarn', ['build']);

  // build.stdout.on('data', (data) => {
    // console.log(`stdout: ${data}`);
  // });

  // build.stderr.on('data', (data) => {
    // console.log(`stderr: ${data}`);
  // });

  // build.on('close', (code) => {
    // console.log(`build process exited with code ${code}`);
  // });
  // launch CLI with mocked google sheets 
  // const scenarios = [{
    // arguments: ['-f', 'yml', '--fitlers', 'tag2'],
    // results: ['./messages.en_US.yml','./messages.pl_PL.yml']
  // }]
  // for (scenario of scenarios){
//     const cli = await spawn('node', ['./build/services/cli/index.js', 'generate-snap', ...scenario.arguments]);
//     cli.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     });

//     cli.stderr.on('data', (data) => {
//       console.log(`stderr: ${data}`);
//     });

//     cli.on('close', (code) => {
//       if (code === 0){
//         console.log(`cli process exited with code ${code}`);
//         // check if expected results are where expected

//       } else {
//         console.log(`cli process exited with non-zero code: ${code}. Bailing.`)
//       }
//     });
//   }
// })()
// check if the expected outputs are snapped
// no - create snap
// yes - compare snap