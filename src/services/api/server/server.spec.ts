import * as awilix from 'awilix';
import * as request from 'supertest';
import InMemoryStorage from '../../../infrastructure/storage/in-memory';
import MaskedTranslations from '../../../shared/translations/masked-translations';
import TranslationsStorage from '../../../shared/translations/translations';
import createContainer from '../container';
import Server from './server';

const container = createContainer().register({
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

    await maskedTranslations.setTranslations([], {
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
    });

    await request(server)
      .get('/translations')
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

    await maskedTranslations.setTranslations([], {
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
    });

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

    await maskedTranslations.setTranslations([], {
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
    });

    await request(server)
      .get('/translations?filters[]=en_US.tag1')
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

    await maskedTranslations.setTranslations([], translations);

    expect(await storage.getData()).toEqual({ translations });

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
      translations,
      'translationsCache-en_us.tag1,en_us.common.sth1': {
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
    const storage = container.resolve<InMemoryStorage>('storage');

    await maskedTranslations.setTranslations([], {});
    await translationsStorage.setTranslations(['en_us.tag1', 'en_us.common.sth1'], {
      en_US: {
        COMMON: {
          STH1: 'Some message ...',
        },
      },
    });

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
  });
});
