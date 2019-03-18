export default interface IStorage {
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
    has(key: string): Promise<boolean>;
    clear(key?: string): Promise<void>;
}
