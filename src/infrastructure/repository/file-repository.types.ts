export enum Permission {
  Read,
  Write,
}

export interface IFileRepository {
  checkAccess(path: string, permission: Permission): Boolean;
  loadData(filename?: string, extension?: string): any;
  saveData(data: any, path?: string, filename?: string, extension?: string): void;
}
