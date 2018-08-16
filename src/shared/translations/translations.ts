export default interface ITranslations {
  clearTranslations(): Promise<void>;
  setTranslations(filters: string[], translations: { [key: string]: any }, format?: string): Promise<void>;
  getTranslations(filters: string[], format?: string): Promise<{ [key: string]: any }>;
}
