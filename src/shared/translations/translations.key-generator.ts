export default class TranslationsKeyGenerator {
  public generateKey(prefix: string, filters: string[], extension?: string) {
    return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}-${extension}`;
  }
}
