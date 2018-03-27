import * as awilix from "awilix";
import * as dotenv from "dotenv";
import createContainer from "./container";
import { LoggerInstance } from "winston";
import GoogleSheets from "./google/sheets";

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

async function main() {
  const logger = container.resolve<LoggerInstance>("logger");

  const data = await container.resolve<GoogleSheets>("googleSheets").fetchSpreadsheet();

  logger.info(data);

  // TODO: download, transform and save translations in storage
}

main();
