#!/usr/bin/env node

import { AwilixContainer } from 'awilix';
import * as dotenv from 'dotenv';
import { ILogger } from 'tsh-node-common';
import * as yargs from 'yargs';
import { Arguments } from 'yargs';
import createContainer from './container';
import { generateEnvConfigFile, generateJsonConfigFile, generateTranslations } from './fileGenerators';

dotenv.config();

const container = createContainer();

process.on('uncaughtException', err => {
  container.resolve<ILogger>('logger').error(err.toString());
  process.exit(1);
});

process.on('unhandledRejection', err => {
  container.resolve<ILogger>('logger').error(err.toString());
  process.exit(1);
});

function configureCli(): Arguments {
  return yargs
    .usage('Usage: generate [-f "format"] [-n "filename"] [-p "path"]')
    .command('generate', 'Generate file with translations')
    .required(1, 'generate')
    .option('config', {
      describe: 'Generates config file with token for google auth',
      type: 'string',
    })
    .option('f', { alias: 'format', default: 'json', describe: 'Format type', type: 'string' })
    .option('p', { alias: 'path', default: '.', describe: 'Path for file save', type: 'string' })
    .option('l', {
      alias: 'language',
      describe: 'Language code for generating translations file only in given language',
      type: 'string',
    })
    .option('n', {
      alias: 'filename',
      default: 'translations',
      describe: 'Filename of result file',
      type: 'string',
    })
    .option('merge', { default: 'false', describe: 'Create one file with all languages', type: 'boolean' })
    .option('client_id', { describe: 'Client ID', type: 'string' })
    .option('client_secret', { describe: 'Client secret', type: 'string' })
    .option('spreadsheet_id', { describe: 'Spreadsheet ID', type: 'string' })
    .option('spreadsheet_name', { describe: 'Spreadsheet name', type: 'string' })
    .option('redirect_uri', { describe: 'The URI to redirect after completing the auth request' })
    .help('?')
    .alias('?', 'help')
    .example(
      '$0 generate -f xml -n my-data -p ./result -l en_US',
      'Generate my-data.xml with english translations in folder /result'
    )
    .example('$0 generate -n my-data', 'Generate file with result in json extension').argv;
}

const configFileGenerators: { [key: string]: any } = {
  env: (args: Arguments) => generateEnvConfigFile(container, args),
  json: async (args: Arguments) => await generateJsonConfigFile(container, args),
};

function getConfigType(config: string | undefined): string | null {
  if (config !== undefined) {
    return config.length === 0 ? 'env' : config;
  }
  return null;
}

async function main() {
  const args: Arguments = configureCli();
  const configType = getConfigType(args.config);
  configType ? await configFileGenerators[configType](args) : await generateTranslations(container, args);
  process.exit(0);
}

main();
