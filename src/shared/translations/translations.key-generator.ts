import { toSuffix } from '../get-version-suffix';

export default class TranslationsKeyGenerator {
  public generateKey(prefix: string, filters: string[], version: string, extension?: string) {
    return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}-${extension}${toSuffix(version)}`;
  }
}
