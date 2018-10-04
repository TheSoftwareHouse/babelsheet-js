import { ILogger } from 'tsh-node-common';
import GoogleSheets from '../../../shared/google/sheets';
import ITransformer from '../../../shared/transformers/transformer';
import TranslationsStorage from '../../../shared/translations/translations';
export default class TranslationsProducer {
    private logger;
    private googleSheets;
    private transformer;
    private translationsStorage;
    constructor(logger: ILogger, googleSheets: GoogleSheets, transformer: ITransformer, translationsStorage: TranslationsStorage);
    produce(authData: any): Promise<void>;
}
