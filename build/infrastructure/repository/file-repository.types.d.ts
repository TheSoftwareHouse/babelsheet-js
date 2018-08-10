export declare enum Permission {
    Read = 0,
    Write = 1
}
export default interface IFileRepository {
    hasAccess(path: string, permission: Permission): boolean;
    loadData(filename: string, extension: string): string | null;
    saveData(data: string, filename: string, extension: string, path?: string): void;
}
