import * as awilix from 'awilix';
import * as ramda from 'ramda';
import createContainer from '../container';
import FakeGoogleSheets from '../../../tests/fakeSheets';
import InMemoryStorage from '../../../infrastructure/storage/in-memory';
import TranslationsProducer from './translations-producer';

import TranslationsStorage from '../../../shared/translations/translations';
import { getLoggerMock } from '../../../tests/loggerMock';
import { spreadsheetData } from '../../../tests/testData';
import { SheetsProviderFactory } from '../../../shared/sheets-provider/sheets-provider.factory';

const VERSION = 'version';

const loggerMock = getLoggerMock();
const sheetsReturnData = spreadsheetData.multiRawSpreadsheetData;
const returnDataParsed = {
  meta: { ...spreadsheetData.meta, filters: [], mergeLanguages: true },
  translations: spreadsheetData.result,
  result: spreadsheetData.result,
  comments: spreadsheetData.comments,
  tags: spreadsheetData.tags,
};
const changedDataParsed = ramda.clone(returnDataParsed);
changedDataParsed.result.en_US.CORE.LABELS.YES = 'yep';

const container = createContainer();

container.register({
  logger: awilix.asValue(loggerMock),
  googleSheets: awilix.asClass(FakeGoogleSheets).inject(() => ({ returnData: sheetsReturnData })),
  sheetsProviderFactory: awilix
    .asClass(SheetsProviderFactory)
    .inject(() => ({ providers: [container.resolve('googleSheets')] })),
  storage: awilix.asClass(InMemoryStorage, { lifetime: awilix.Lifetime.SINGLETON }),
});

describe('Producer', () => {
  beforeEach(async () => {
    const storage = container.resolve<InMemoryStorage>('storage');

    await storage.clear();
  });

  it('Refreshes translations if they changed.', async () => {
    const producer = await container.resolve<TranslationsProducer>('translationsProducer');
    await container.resolve<TranslationsStorage>('translationsStorage').setTranslations([], changedDataParsed, VERSION);
    expect(await container.resolve<TranslationsStorage>('translationsStorage').getTranslations([], VERSION)).toEqual(
      changedDataParsed
    );
    await producer.produce(
      {},
      container.resolve<SheetsProviderFactory>('sheetsProviderFactory').getProviderFor('google')
    );
    expect(await container.resolve<TranslationsStorage>('translationsStorage').getTranslations([], VERSION)).toEqual(
      returnDataParsed
    );
  });
});
