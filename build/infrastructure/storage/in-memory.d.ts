import IStorage from './storage';
export default class InMemoryStorage implements IStorage {
    private data;
    constructor();
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    has(key: string): Promise<boolean>;
    getData(): Promise<any>;
    clear(): Promise<void>;
}
