import Server from "./server";
import { LoggerInstance } from "winston";
import * as dotenv from "dotenv";
import createContainer from "./container";

dotenv.config();

const container = createContainer();

process.on("uncaughtException", err => {
  container.resolve<LoggerInstance>("logger").error(err.toString());
  process.exit(1);
});

process.on("unhandledRejection", err => {
  container.resolve<LoggerInstance>("logger").error(err.toString());
  process.exit(1);
});

const server = container.resolve<Server>("server").getApp();

server.listen(container.resolve("port"));
