import { ILogger } from 'tsh-node-common/build';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';
import InEnvStorage from '../../../infrastructure/storage/in-env';
import InFileStorage from '../../../infrastructure/storage/in-file';
import GoogleAuth from '../../../shared/google/auth';
import { SheetsProviderFactory } from '../../../shared/sheets-provider/sheets-provider.factory';
import Transformers from '../../../shared/transformers/transformers';
import FilesCreators from '../files-creators/files-creators';
import { ConfigProviderFactory } from './../spreadsheet-config-providers/config-provider.factory';
export default class Interpreter {
    private shadowArgs;
    private logger;
    private inEnvStorage;
    private inFileStorage;
    private googleAuth;
    private fileRepository;
    private sheetsProviderFactory;
    private configProviderFactory;
    private transformers;
    private filesCreators;
    private getProperStorage;
    constructor(shadowArgs: undefined | string | string[], logger: ILogger, inEnvStorage: InEnvStorage, inFileStorage: InFileStorage, googleAuth: GoogleAuth, fileRepository: IFileRepository, sheetsProviderFactory: SheetsProviderFactory, configProviderFactory: ConfigProviderFactory, transformers: Transformers, filesCreators: FilesCreators);
    interpret(overwriteShadowArgs?: string[] | undefined): Promise<void>;
    private configureCli;
    private getSpreadsheetConfigProvider;
    private getSpreadsheetProvider;
}
