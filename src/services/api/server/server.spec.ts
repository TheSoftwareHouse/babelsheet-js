import * as awilix from 'awilix';
import * as request from 'supertest';
import InMemoryStorage from '../../../infrastructure/storage/in-memory';
import MaskedTranslations from '../../../shared/translations/masked-translations';
import TranslationsStorage from '../../../shared/translations/translations';
import createContainer from '../container';
import Server from './server';
import { getLoggerMock } from '../../../tests/loggerMock';

const loggerMock = getLoggerMock();

const DEFAULT_VERSION = 'Sheet1';

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

    await maskedTranslations.setTranslations(
      [],
      {
        tags: {
          tag1: {
            COMMON: {
              STH1: null,
            },
          },
          tag2: {
            CORE: {
              LABELS: {
                YES: null,
              },
            },
            COMMON: {
              STH1: null,
            },
          },
        },
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
              NO: 'no',
            },
          },
          COMMON: {
            STH1: 'Some message ...',
            FORM: {
              COMMENT: 'comment',
            },
          },
        },
      },
      DEFAULT_VERSION
    );

    await request(server)
      .get(`/translations?version=${DEFAULT_VERSION}`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          en_US: {
            CORE: {
              LABELS: {
                YES: 'yes',
                NO: 'no',
              },
            },
            COMMON: {
              STH1: 'Some message ...',
              FORM: {
                COMMENT: 'comment',
              },
            },
          },
        });
      });
  });

  it('returns bad request when filter param is empty', async () => {
    const server = container.resolve<Server>('server').getApp();

    await request(server)
      .get(`/translations?version=${DEFAULT_VERSION}&filters[]=`)
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

    await maskedTranslations.setTranslations(
      [],
      {
        tags: {
          tag1: {
            COMMON: {
              STH1: null,
            },
          },
          tag2: {
            CORE: {
              LABELS: {
                YES: null,
              },
            },
            COMMON: {
              STH1: null,
            },
          },
        },
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
              NO: 'no',
            },
          },
          COMMON: {
            STH1: 'Some message ...',
            FORM: {
              COMMENT: 'comment',
            },
          },
        },
      },
      DEFAULT_VERSION
    );

    await request(server)
      .get('/translations?filters[]=en_US.CORE.LABELS&filters[]=en_US.COMMON.STH1')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          en_US: {
            CORE: {
              LABELS: {
                YES: 'yes',
                NO: 'no',
              },
            },
            COMMON: {
              STH1: 'Some message ...',
            },
          },
        });
      });
  });

  it('returns translations filtered by tag', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');

    await maskedTranslations.setTranslations(
      [],
      {
        tags: {
          tag1: {
            COMMON: {
              STH1: null,
            },
          },
          tag2: {
            CORE: {
              LABELS: {
                YES: null,
              },
            },
            COMMON: {
              STH1: null,
            },
          },
        },
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
              NO: 'no',
            },
          },
          COMMON: {
            STH1: 'Some message ...',
            FORM: {
              COMMENT: 'comment',
            },
          },
        },
      },
      DEFAULT_VERSION
    );

    await request(server)
      .get(`/translations?filters[]=en_US.tag1&version=${DEFAULT_VERSION}`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          en_US: {
            COMMON: {
              STH1: 'Some message ...',
            },
          },
        });
      });
  });

  it('returns translations and stores them in cache', async () => {
    const server = container.resolve<Server>('server').getApp();
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');
    const storage = container.resolve<InMemoryStorage>('storage');

    const translations = {
      tags: {
        tag1: {
          COMMON: {
            STH1: null,
          },
        },
      },
      en_US: {
        COMMON: {
          STH1: 'Some message ...',
          FORM: {
            COMMENT: 'comment',
          },
        },
      },
    };

    await maskedTranslations.setTranslations([], translations, DEFAULT_VERSION);

    expect(await storage.getData()).toEqual({ [`translations-${DEFAULT_VERSION}`]: translations });

    await request(server)
      .get('/translations?filters[]=en_US.tag1&filters[]=en_US.COMMON.STH1')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          en_US: {
            COMMON: {
              STH1: 'Some message ...',
            },
          },
        });
      });

    expect(await storage.getData()).toEqual({
      [`translations-${DEFAULT_VERSION}`]: translations,
      [`translationsCache-en_us.tag1,en_us.common.sth1-json-${DEFAULT_VERSION}`]: {
        en_US: {
          COMMON: {
            STH1: 'Some message ...',
          },
        },
      },
    });
  });

  it('returns translations from cache', async () => {
    const server = container.resolve<Server>('server').getApp();
    const translationsStorage = container.resolve<TranslationsStorage>('translationsStorage');
    const maskedTranslations = container.resolve<MaskedTranslations>('maskedTranslations');
    // const storage = container.resolve<InMemoryStorage>('storage');

    await maskedTranslations.setTranslations([], {}, DEFAULT_VERSION);
    await translationsStorage.setTranslations(
      ['en_us.tag1', 'en_us.common.sth1'],
      {
        en_US: {
          COMMON: {
            STH1: 'Some message ...',
          },
        },
      },
      DEFAULT_VERSION,
      'json'
    );

    await request(server)
      .get(`/translations?filters[]=en_US.tag1&filters[]=en_US.COMMON.STH1`)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          en_US: {
            COMMON: {
              STH1: 'Some message ...',
            },
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

    await maskedTranslations.setTranslations(
      [],
      {
        tags: {
          tag1: {
            COMMON: {
              STH1: null,
            },
          },
          tag2: {
            CORE: {
              LABELS: {
                YES: null,
              },
            },
            COMMON: {
              STH1: null,
            },
          },
        },
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
              NO: 'no',
            },
          },
          COMMON: {
            STH1: 'Some message ...',
            FORM: {
              COMMENT: 'comment',
            },
          },
        },
      },
      DEFAULT_VERSION
    );

    await request(server)
      .get('/translations?filters[]=en_US.tag1&format=android')
      .expect(200)
      .then(res => {
        expect(res.header['content-type']).toEqual('application/xml; charset=utf-8');
        expect(res.text).toEqual(
          `<?xml version=\"1.0\"?>
<resources>
  <string name=\"en_us_common_sth1\">Some message ...</string>
</resources>`
        );
      });
  });
});
