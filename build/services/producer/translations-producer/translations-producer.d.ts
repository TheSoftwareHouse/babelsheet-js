import { ILogger } from 'tsh-node-common';
import { ISheetsProvider } from '../../../shared/sheets-provider/sheets-provider.types';
import ITransformer from '../../../shared/transformers/transformer';
import TranslationsStorage from '../../../shared/translations/translations';
export default class TranslationsProducer {
    private logger;
    private transformer;
    private translationsStorage;
    constructor(logger: ILogger, transformer: ITransformer, translationsStorage: TranslationsStorage);
    produce(config: any, sheetsProvider: ISheetsProvider): Promise<void>;
}
