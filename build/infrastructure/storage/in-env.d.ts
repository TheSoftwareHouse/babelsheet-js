import Storage from './storage';
export default class InEnvStorage implements Storage {
    private data;
    constructor();
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    has(key: string): Promise<boolean>;
    clear(): Promise<void>;
    private tryParse;
}
