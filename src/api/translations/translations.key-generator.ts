export default class TranslationsKeyGenerator {
  public generateKey(prefix: string, filters: string[]) {
    return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}`;
  }
}
