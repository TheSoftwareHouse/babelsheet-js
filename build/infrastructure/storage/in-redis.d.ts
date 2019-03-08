import IStorage from './storage';
export default class InRedisStorage implements IStorage {
    private client;
    constructor();
    set(key: string, value: any): Promise<any>;
    get(key: string): Promise<any>;
    has(key: string): Promise<any>;
    clear(key?: string): Promise<any>;
}
