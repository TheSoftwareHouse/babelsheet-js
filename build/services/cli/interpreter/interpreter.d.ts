import InEnvStorage from "../../../infrastructure/storage/in-env";
import InFileStorage from "../../../infrastructure/storage/in-file";
import { ILogger } from "tsh-node-common/build";
import GoogleAuth from "../../../shared/google/auth";
import IFileRepository from "../../../infrastructure/repository/file-repository.types";
import GoogleSheets from "../../../shared/google/sheets";
import Transformers from "../../../shared/transformers/transformers";
import FilesCreators from "../files-creators/files-creators";
export default class Interpreter {
    private shadowArgs;
    private logger;
    private inEnvStorage;
    private inFileStorage;
    private googleAuth;
    private fileRepository;
    private googleSheets;
    private transformers;
    private filesCreators;
    constructor(shadowArgs: undefined | string | string[], logger: ILogger, inEnvStorage: InEnvStorage, inFileStorage: InFileStorage, googleAuth: GoogleAuth, fileRepository: IFileRepository, googleSheets: GoogleSheets, transformers: Transformers, filesCreators: FilesCreators);
    private configureCli;
    private getProperStorage;
    interpret(): Promise<void>;
}
