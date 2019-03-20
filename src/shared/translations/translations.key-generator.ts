import { toSuffix } from '../get-version-suffix';

export default class TranslationsKeyGenerator {
  public generateKey(
    prefix: string,
    filters: string[],
    version: string,
    extension?: string,
    keepLocale?: boolean,
    comments?: boolean
  ) {
    return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}-${extension}-${
      keepLocale ? 1 : 0
    }-${comments ? 1 : 0}${toSuffix(version)}`;
  }
}
