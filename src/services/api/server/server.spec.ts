import * as awilix from 'awilix';
import * as request from 'supertest';
import InMemoryStorage from '../../../infrastructure/storage/in-memory';
import MaskedTranslations from '../../../shared/translations/masked-translations';
import TranslationsStorage from '../../../shared/translations/translations';
import createContainer from '../container';
import Server from './server';
import { getLoggerMock } from '../../../tests/loggerMock';
import { minimalPassingObject, multiLocaleDataset } from '../../../tests/testData';

const DEFAULT_VERSION = 'Sheet1';

const loggerMock = getLoggerMock();

const container = createContainer().register({
  logger: awilix.asValue(loggerMock),
  storage: awilix.asClass(InMemoryStorage, { lifetime: awilix.Lifetime.SINGLETON }),
});

describe('Server', () => {
  beforeEach(async () => {
    const storage = container.resolve<InMemoryStorage>('storage');

    await storage.clear();
  });

  it('returns 404 when there are no translations', async () => {
    const server = container.resolve<Server>('server').getApp();
    const translationsStorage = container.resolve<TranslationsStorage>('translationsStorage');
    await request(server)
      .get('/translations')
      .expect(404)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Translations not found',
          status: 404,
        });
      });
  });

  it('returns translations', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    await maskedTranslations.setTranslations([], minimalPassingObject, DEFAULT_VERSION);

    await request(server)
      .get(`/translations?version=${DEFAULT_VERSION}`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(minimalPassingObject.result.en_US);
      });
  });

  it('returns bad request when filter param is empty', async () => {
    const server = container.resolve<Server>('server').getApp();

    await request(server)
      .get('/translations?filters[]=')
      .expect(400)
      .then(res => {
        expect(res.body).toEqual({
          error: 'Bad Request',
          message:
            'child "filters" fails because ["filters" at position 0 fails because ["0" is not allowed to be empty]]',
          statusCode: 400,
          validation: { keys: ['filters.0'], source: 'query' },
        });
      });
  });

  it('returns filtered translations', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };
    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get('/translations?filters[]=en_US.CORE.LABELS.YES&filters[]=en_US.CORE.LABELS.SAVE')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          CORE: {
            LABELS: {
              YES: 'yes',
              SAVE: 'save',
            },
          },
        });
      });
  });

  it('returns translations filtered by tag', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };

    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get(`/translations?filters[]=en_US.tag1&version=${DEFAULT_VERSION}`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          CORE: {
            LABELS: {
              YES: 'yes',
            },
          },
        });
      });
  });

  it('returns translations and stores them in cache', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');
    const storage = container.resolve<InMemoryStorage>('storage');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };

    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    // todo: just : object ?
    expect(await storage.getData()).toEqual({ [`translations-${DEFAULT_VERSION}`]: { ...object } });

    await request(server)
      .get('/translations?filters[]=en_US.CORE.LABELS.YES&filters[]=en_US.CORE.LABELS.SAVE')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          CORE: {
            LABELS: {
              YES: 'yes',
              SAVE: 'save',
            },
          },
        });
      });

    expect(await storage.getData()).toEqual({
      [`translations-${DEFAULT_VERSION}`]: { ...object },
      [`translationsCache-en_us.core.labels.yes,en_us.core.labels.save-json-0-0-${DEFAULT_VERSION}`]: {
        ...object,
        meta: {
          ...object.meta,
          mergeLanguages: true,
          includeComments: false,
          filters: ['en_US.CORE.LABELS.YES', 'en_US.CORE.LABELS.SAVE'],
        },
        result: {
          CORE: {
            LABELS: {
              YES: 'yes',
              SAVE: 'save',
            },
          },
        },
      },
    });
  });

  it('returns translations from cache', async () => {
    const server = container.resolve<Server>('server').getApp();
    const translationsStorage = container.resolve<TranslationsStorage>('translationsStorage');
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');
    const storage = container.resolve<InMemoryStorage>('storage');

    await maskedTranslations.setTranslations([], {}, DEFAULT_VERSION);
    await translationsStorage.setTranslations(
      ['en_us.tag1'],
      {
        result: {
          COMMON: {
            STH1: 'Some message ...',
          },
        },
      },
      DEFAULT_VERSION,
      'json'
    );

    await request(server)
      .get('/translations?filters[]=en_US.tag1')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          COMMON: {
            STH1: 'Some message ...',
          },
        });
      });
  });

  it('returns bad request if format does not exists', async () => {
    const server = container.resolve<Server>('server').getApp();

    await request(server)
      .get('/translations?filters[]=en_US&format=xyz')
      .expect(500)
      .then(res => {
        expect(res.body).toEqual({
          message: "Not possible to create translations for format 'xyz'",
          status: 500,
        });
      });
  });

  it('returns translations in xml', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };
    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get('/translations?filters[]=en_US.tag1&format=android')
      .expect(200)
      .then(res => {
        expect(res.header['content-type']).toEqual('application/xml; charset=utf-8');
        expect(res.text).toEqual(
          `<?xml version=\"1.0\"?>
<resources>
  <string name=\"core_labels_yes\">yes</string>
</resources>`
        );
      });
  });
  it('returns translations with language prefix when only one language is returned and keeping is forced', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };

    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get('/translations?filters[]=en_US.tag1&format=android&keepLocale=true')
      .expect(200)
      .then(res => {
        expect(res.header['content-type']).toEqual('application/xml; charset=utf-8');
        expect(res.text).toEqual(
          `<?xml version=\"1.0\"?>
<resources>
  <string name=\"en_us_core_labels_yes\">yes</string>
</resources>`
        );
      });
  });
  it('returns translations without language prefix when only one language is returned', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };

    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get('/translations?filters[]=en_US.tag1&format=android')
      .expect(200)
      .then(res => {
        expect(res.header['content-type']).toEqual('application/xml; charset=utf-8');
        expect(res.text).toEqual(
          `<?xml version=\"1.0\"?>
<resources>
  <string name=\"core_labels_yes\">yes</string>
</resources>`
        );
      });
  });
  it('returns translations with language prefixes when multiple languages are in results', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
    };

    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get('/translations?format=android')
      .expect(200)
      .then(res => {
        expect(res.header['content-type']).toEqual('application/xml; charset=utf-8');
        expect(res.text).toEqual(
          `<?xml version=\"1.0\"?>
<resources>
  <string name=\"en_us_core_labels_yes\">yes</string>
  <string name=\"en_us_core_labels_no\">no</string>
  <string name=\"en_us_core_labels_save\">save</string>
  <string name=\"en_us_core_labels_cancel\">cancel</string>
  <string name=\"pl_pl_core_labels_yes\">tak</string>
  <string name=\"pl_pl_core_labels_no\">nie</string>
  <string name=\"pl_pl_core_labels_save\">zapisz</string>
</resources>`
        );
      });
  });
  it('returns translations with comments', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');
    const object = {
      meta: multiLocaleDataset.meta,
      tags: multiLocaleDataset.tags,
      result: multiLocaleDataset.translations,
      comments: multiLocaleDataset.comments,
    };

    await maskedTranslations.setTranslations([], object, DEFAULT_VERSION);

    await request(server)
      .get('/translations?format=android&comments=true')
      .expect(200)
      .then(res => {
        expect(res.header['content-type']).toEqual('application/xml; charset=utf-8');
        expect(res.text).toEqual(
          `<?xml version=\"1.0\"?>
<resources>
  <string name=\"en_us_core_labels_yes\">yes</string>
  <!-- Affirmative, give consent -->
  <string name=\"en_us_core_labels_no\">no</string>
  <!-- Negative, refuse consent -->
  <string name=\"en_us_core_labels_save\">save</string>
  <!-- Persist, save consent -->
  <string name=\"en_us_core_labels_cancel\">cancel</string>
  <string name=\"pl_pl_core_labels_yes\">tak</string>
  <!-- Affirmative, give consent -->
  <string name=\"pl_pl_core_labels_no\">nie</string>
  <!-- Negative, refuse consent -->
  <string name=\"pl_pl_core_labels_save\">zapisz</string>
  <!-- Persist, save consent -->
</resources>`
        );
      });
  });
});
