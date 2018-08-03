import * as yargs from 'yargs';
import { Options } from 'yargs';
import { ILogger } from '../../../node_modules/node-common';
import createContainer from './container';
import Formatter from './formater';

const container = createContainer();

function main() {
  const fOptions: Options = {
    alias: 'format',
    default: 'json',
    describe: 'Format to export',
    type: 'string',
  };
  const argv = yargs.usage('Usage: $0 generate [-f "format"]').option('f', fOptions).argv;

  container.resolve<Formatter>('formatter').format(argv.f);
  container.resolve<ILogger>('logger').info('formatted!');
}

main();
