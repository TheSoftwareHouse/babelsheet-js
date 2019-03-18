import to from 'await-to-js';
import * as ramda from 'ramda';
import { ILogger } from 'tsh-node-common';
import GoogleSheets from '../../../shared/google/sheets';
import ITransformer from '../../../shared/transformers/transformer';
import TranslationsStorage from '../../../shared/translations/translations';

export default class TranslationsProducer {
  constructor(
    private logger: ILogger,
    private googleSheets: GoogleSheets,
    private transformer: ITransformer,
    private translationsStorage: TranslationsStorage
  ) {}
  public async produce(authData: any) {
    const spreadsheetData = await this.googleSheets.fetchSpreadsheet(authData);

    const transformedSheets: { [key: string]: any } = await Object.keys(spreadsheetData).reduce(
      async (transformedTranslationsPromise: Promise<{ [key: string]: any }>, key) => {
        const values = spreadsheetData[key];

        if (!values) {
          return transformedTranslationsPromise;
        }

        const data = await this.transformer.transform({
          translations: {},
          meta: { mergeLanguages: true },
          result: spreadsheetData[key],
        });
        const transformedTranslations = await transformedTranslationsPromise;

        transformedTranslations[key] = data;

        return transformedTranslationsPromise;
      },
      Promise.resolve({})
    );

    for (const key of Object.keys(transformedSheets)) {
      const [, actualTranslations] = await to(this.translationsStorage.getTranslations([], key));

      if (!ramda.equals(transformedSheets[key], actualTranslations)) {
        await this.translationsStorage.clearTranslations(key);
        await this.translationsStorage.setTranslations([], transformedSheets[key], key);

        this.logger.info(`Translations (version ${key}) were refreshed`);
      }
    }
  }
}
