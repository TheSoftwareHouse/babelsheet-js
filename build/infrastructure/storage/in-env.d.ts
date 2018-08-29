import FileRepository from '../repository/file.repository';
import Storage from './storage';
export default class InEnvStorage implements Storage {
    private fileRepository;
    constructor(fileRepository: FileRepository);
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    has(key: string): Promise<boolean>;
    clear(): Promise<void>;
    private updateEnvsInFile;
    private tryParse;
}
