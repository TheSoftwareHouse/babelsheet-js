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
    const transformedData = await this.transformer.transform({
      translations: {},
      meta: {
        mergeLanguages: true,
      },
      result: spreadsheetData,
    });

    const [, actualTranslations] = await to(this.translationsStorage.getTranslations([]));

    if (!ramda.equals(transformedData, actualTranslations)) {
      await this.translationsStorage.clearTranslations();
      await this.translationsStorage.setTranslations([], transformedData);

      this.logger.info('Translations were refreshed');
    }
  }
}
