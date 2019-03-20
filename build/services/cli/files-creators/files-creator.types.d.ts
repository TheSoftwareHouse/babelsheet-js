import { ITranslationsData } from '../../../shared/transformers/transformer';
export interface IFilesCreator {
    supports(extension: string): boolean;
    save(dataToSave: ITranslationsData, path: string, filename: string, version: string, baseLang?: string): void;
}
