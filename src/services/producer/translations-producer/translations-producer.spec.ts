import * as awilix from 'awilix';
import * as request from 'supertest';
import * as ramda from 'ramda';
import createContainer from '../container';
import FakeGoogleSheets from '../../../tests/fakeSheets';
import InMemoryStorage from '../../../infrastructure/storage/in-memory';
import TranslationsProducer from './translations-producer';

import TranslationsStorage from '../../../shared/translations/translations';
import { getLoggerMock } from '../../../tests/loggerMock';

const loggerMock = getLoggerMock();
const sheetsReturnData = {
  '10': ['###', '>>>', '>>>', '>>>', '', 'en_US', 'pl_PL'],
  '11': ['', 'CORE'],
  '12': ['', '', 'LABELS'],
  '13': ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
  '14': ['', '', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
  '15': ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
  '16': ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
};

const returnDataParsed = {
  en_US: {
    CORE: {
      LABELS: {
        YES: 'yes',
        NO: 'no',
        SAVE: 'save',
        CANCEL: 'cancel',
      },
    },
  },
  pl_PL: {
    CORE: {
      LABELS: {
        YES: 'tak',
        NO: 'nie',
        SAVE: 'zapisz',
      },
    },
  },
};

const changedDataParsed = ramda.clone(returnDataParsed);
changedDataParsed.en_US.CORE.LABELS.YES = 'yep';

const container = createContainer().register({
  logger: awilix.asValue(loggerMock),
  googleSheets: awilix.asClass(FakeGoogleSheets).inject(() => ({ returnData: sheetsReturnData })),
  storage: awilix.asClass(InMemoryStorage, { lifetime: awilix.Lifetime.SINGLETON }),
});

describe('Producer', () => {
  beforeEach(async () => {
    const storage = container.resolve<InMemoryStorage>('storage');

    await storage.clear();
  });
  it('Puts translations into the storage', async () => {
    const producer = await container.resolve<TranslationsProducer>('translationsProducer');
    await container.resolve<TranslationsStorage>('translationsStorage').setTranslations([], changedDataParsed);
    expect(await container.resolve<TranslationsStorage>('translationsStorage').getTranslations([])).toEqual(
      changedDataParsed
    );
    await producer.produce({});
    expect(await container.resolve<TranslationsStorage>('translationsStorage').getTranslations([])).toEqual(
      returnDataParsed
    );
  });
});
