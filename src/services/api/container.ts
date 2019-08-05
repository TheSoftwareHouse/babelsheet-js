import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'tsh-node-common';
import InRedisStorage from '../../infrastructure/storage/in-redis';
import ErrorHandler from '../../shared/error/handler';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import ChainTransformer from '../../shared/transformers/chain.transformer';
import FlatListToIosStringsTransformer from '../../shared/transformers/flat-list-to-ios-strings.transformer';
import FlatListToPoTransformer from '../../shared/transformers/flat-list-to-po.transformer';
import FlatListToXlfTransformer from '../../shared/transformers/flat-list-to-xlf.transformer';
import FlatListToXmlTransformer from '../../shared/transformers/flat-list-to-xml.transformer';
import JsonToFlatListTransformer from '../../shared/transformers/json-to-flat-list.transformer';
import JsonToJsonMaskedTransformer from '../../shared/transformers/json-to-json-masked.transformer';
import JsonToJsonTransformer from '../../shared/transformers/json-to-json.transformer';
import JsonToYamlTransformer from '../../shared/transformers/json-to-yaml.transformer';
import Transformers from '../../shared/transformers/transformers';
import CachedTranslations from '../../shared/translations/cached-translations';
import MaskedTranslations from '../../shared/translations/masked-translations';
import TranslationsKeyGenerator from '../../shared/translations/translations.key-generator';
import Server from './server/server';
import TranslationsController from './translations/translations.controller';
import TranslationsRouting from './translations/translations.routing';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  const transformersRegistry = {
    flatListToIosStringsTransformer: awilix.asClass(FlatListToIosStringsTransformer, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    flatListToXlfTransformer: awilix.asClass(FlatListToXlfTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    flatListToXmlTransformer: awilix.asClass(FlatListToXmlTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    flatListToPoTransformer: awilix.asClass(FlatListToPoTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToJsonMaskedTransformer: awilix.asClass(JsonToJsonMaskedTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToFlatListTransformer: awilix.asClass(JsonToFlatListTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToJsonTransformer: awilix.asClass(JsonToJsonTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToXmlTransformer: awilix.asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      supportedType: 'json-xml',
      transformers: [
        container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
        container.resolve<FlatListToXmlTransformer>('flatListToXmlTransformer'),
      ],
    })),
    jsonToIosStringsTransformer: awilix.asClass(ChainTransformer).inject(() => ({
      supportedType: 'json-ios-strings',
      transformers: [
        container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
        container.resolve<FlatListToIosStringsTransformer>('flatListToIosStringsTransformer'),
      ],
    })),
    jsonToXlfTransformer: awilix.asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      supportedType: 'json-xlf',
      transformers: [
        container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
        container.resolve<FlatListToXlfTransformer>('flatListToXlfTransformer'),
      ],
    })),
    jsonToPoTransformer: awilix.asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      supportedType: 'json-po',
      transformers: [
        container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
        container.resolve<FlatListToPoTransformer>('flatListToPoTransformer'),
      ],
    })),
    jsonToYamlTransformer: awilix.asClass(JsonToYamlTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    transformers: awilix.asClass(Transformers, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      transformers: [
        container.resolve<ChainTransformer>('jsonToXmlTransformer'),
        container.resolve<ChainTransformer>('jsonToIosStringsTransformer'),
        container.resolve<JsonToJsonTransformer>('jsonToJsonTransformer'),
        container.resolve<ChainTransformer>('jsonToXlfTransformer'),
        container.resolve<ChainTransformer>('jsonToPoTransformer'),
        container.resolve<JsonToYamlTransformer>('jsonToYamlTransformer'),
      ],
    })),
  };

  container.register({
    errorHandler: awilix.asClass(ErrorHandler),
    logger: awilix.asValue(winstonLogger),
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
    maskedTranslations: awilix.asClass(MaskedTranslations),
    port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
    server: awilix.asClass(Server),
    storage: awilix.asClass(InRedisStorage),
    translationsController: awilix.asClass(TranslationsController),
    translationsKeyGenerator: awilix.asClass(TranslationsKeyGenerator),
    translationsRouting: awilix.asClass(TranslationsRouting),
    translationsStorage: awilix.asClass(CachedTranslations),
    ...transformersRegistry,
  });

  return container;
}
