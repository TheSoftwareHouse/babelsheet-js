import * as awilix from 'awilix';
import MaskedTranslations from './masked-translations';
import InMemoryStorage from '../../infrastructure/storage/in-memory';
import NotFoundError from '../error/not-found';
import { minimalPassingObject, multiLocaleDataset } from '../../tests/testData';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
});

container.register({
  storage: awilix.asClass(InMemoryStorage, { lifetime: awilix.Lifetime.SINGLETON }),
  jsonToJsonMaskedTransformer: awilix.asValue({
    supports: type => false,
    transform: jest.fn(source => ({
      ...source,
      result: Object.keys(source.result).reduce((accumulator: any, key: string) => {
        accumulator[key] = { value: 'json masked return' };
        return accumulator;
      }, {}),
    })),
  }),
  maskedTranslations: awilix.asClass(MaskedTranslations),
});

const storageMock = {
  get: jest.fn(),
  set: jest.fn(),
  has: jest.fn(),
  clear: jest.fn(),
};
const maskedTranslations2 = new MaskedTranslations(storageMock, () => {});

describe('Masked translations', () => {
  beforeEach(async () => {
    const storage = container.resolve<InMemoryStorage>('storage');

    await storage.clear();
  });
  it('takes translations from storage', async () => {
    try {
      await maskedTranslations2.getTranslations();
    } catch (error) {}
    expect(storageMock.get).toBeCalledWith('translations');
  });
  it('throws then translations are not found', async () => {
    const maskedTranslations = await container.resolve<MaskedTranslations>('maskedTranslations');
    expect(maskedTranslations.getTranslations([])).rejects.toEqual(new NotFoundError('Translations not found'));
  });
  it('returns masked translations (taken from storage)', async () => {
    const maskedTranslations = await container.resolve<MaskedTranslations>('maskedTranslations');
    const storage = await container.resolve<InMemoryStorage>('storage');

    storage.set('translations', minimalPassingObject);
    expect(await maskedTranslations.getTranslations([])).toEqual({
      ...minimalPassingObject,
      meta: { ...minimalPassingObject.meta, filters: [], mergeLanguages: true },
      result: { value: 'json masked return' },
    });
  });
  it('skips locale if possible', async () => {
    const maskedTranslations = await container.resolve<MaskedTranslations>('maskedTranslations');
    const storage = await container.resolve<InMemoryStorage>('storage');

    storage.set('translations', { ...minimalPassingObject, result: { en_US: multiLocaleDataset.translations.en_US } });

    expect(await maskedTranslations.getTranslations([])).toEqual({
      ...minimalPassingObject,
      meta: { ...minimalPassingObject.meta, filters: [], mergeLanguages: true },
      result: { value: 'json masked return' },
    });
  });
  it('keeps locale if skipping is possible, but keeping is forced', async () => {
    const maskedTranslations = await container.resolve<MaskedTranslations>('maskedTranslations');
    const storage = await container.resolve<InMemoryStorage>('storage');

    storage.set('translations-version', {
      ...minimalPassingObject,
      result: { en_US: multiLocaleDataset.translations.en_US },
    });

    expect(await maskedTranslations.getTranslations([], 'version', { keepLocale: true })).toEqual({
      ...minimalPassingObject,
      meta: { ...minimalPassingObject.meta, filters: [], mergeLanguages: true },
      result: { en_US: { value: 'json masked return' } },
    });
  });
});
