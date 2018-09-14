import * as dotenv from 'dotenv';
dotenv.config();

import { ILogger } from 'tsh-node-common';
import createContainer from './container';
import Server from './server/server';

const container = createContainer();

process.on('uncaughtException', err => {
  container.resolve<ILogger>('logger').error(err.toString());
  process.exit(1);
});

process.on('unhandledRejection', err => {
  container.resolve<ILogger>('logger').error(err.toString());
  process.exit(1);
});

const server = container.resolve<Server>('server').getApp();

server.listen(container.resolve('port'));
