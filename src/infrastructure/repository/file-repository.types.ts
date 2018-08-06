export enum Permission {
  Read,
  Write,
}

export default interface IFileRepository {
  hasAccess(path: string, permission: Permission): boolean;
  loadData(filename: string, extension: string): any;
  saveData(data: any, filename: string, extension: string, path?: string): void;
}
