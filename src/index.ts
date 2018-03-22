import * as awilix from "awilix";
import Server from "./server";
import * as winston from "winston";

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOGGING_LEVEL || "debug",
      timestamp: () => new Date().toISOString()
    })
  ]
});

container.register({
  server: awilix.asClass(Server),
  logger: awilix.asValue(winstonLogger)
});

const server = container.resolve<Server>("server").getApp();

const port: any = process.env.PORT || 3000;

server.listen(port);
