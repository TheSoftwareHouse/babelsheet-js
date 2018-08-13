import IFileRepository from '../repository/file-repository.types';
import IStorage from './storage';
export default class InFileStorage implements IStorage {
    private fileRepository;
    constructor(fileRepository: IFileRepository);
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    has(key: string): Promise<boolean>;
    clear(): Promise<void>;
    private loadData;
    private saveData;
}
