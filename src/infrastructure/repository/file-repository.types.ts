export default interface IFileRepository {
  loadData(filename?: string, extension?: string): any;
  saveData(data: any, filename?: string, extension?: string): void;
}
