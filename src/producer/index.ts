import * as dotenv from "dotenv";
import * as schedule from "node-schedule";
import { LoggerInstance } from "winston";
import TranslationsStorage from "../shared/translations/translations";
import createContainer from "./container";
import GoogleSheets from "./google/sheets";
import ITransformer from "./transformer/transformer";

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
  const spreadsheetData = await container.resolve<GoogleSheets>("googleSheets").fetchSpreadsheet();

  const transformedData = await container.resolve<ITransformer>("transformer").transform(spreadsheetData);

  container.resolve<TranslationsStorage>("translationsStorage").setTranslations(transformedData);
}

schedule.scheduleJob("* * * * *", () => {
  main();
});
