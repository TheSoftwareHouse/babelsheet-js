import { AwilixContainer } from 'awilix';
import { Arguments } from 'yargs';
import IStorage from '../../infrastructure/storage/storage';
export declare function generateTranslations(container: AwilixContainer, args: Arguments): Promise<void>;
export declare function generateConfigFile(container: AwilixContainer, args: Arguments, storage: IStorage): Promise<void>;
