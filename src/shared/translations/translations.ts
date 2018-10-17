export default interface ITranslations {
  clearTranslations(): Promise<void>;
  setTranslations(filters: string[], translations: { [key: string]: any }, format?: string): Promise<void>;
  getTranslations(
    filters: string[],
    options?: { format?: string; keepLocale?: boolean; includeComments?: boolean }
  ): Promise<{ [key: string]: any }>;
}
