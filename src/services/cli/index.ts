// import { winstonLogger } from 'node-common';
// winstonLogger.info('test2');
import * as yargs from 'yargs';

function main() {
  const fOptions: yargs.Options = {
    alias: 'format',
    default: 'json',
    describe: 'Format to export',
    type: 'string',
  };
  const argv = yargs.usage('Usage: $0 generate [-f "format"]').option('f', fOptions).argv;

  switch (argv.f) {
    case 'xml':
      formatXML();
      break;
    case 'json':
    default:
      formatJson();
      break;
  }
}

function formatJson() {
  console.log('formatJson!!');
}

function formatXML() {
  console.log('formatXML!');
}

main();
