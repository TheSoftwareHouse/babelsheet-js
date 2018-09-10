import ITransformer from './transformer';

export default class SpreadsheetToYamlTransformer implements ITransformer {
  private readonly supportedType = 'yaml';

  constructor(private spreadsheetToJson: ITransformer, private jsonToYaml: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    langCode?: string,
    mergeLanguages?: boolean
  ): string | object[] {
    const json = this.spreadsheetToJson.transform(source, langCode);

    if (mergeLanguages || langCode) {
      return this.jsonToYaml.transform(json);
    }

    return Object.keys(json).map(langName => {
      const yamlTranslations = this.jsonToYaml.transform(json[langName]);
      return { lang: langName, content: yamlTranslations };
    });
  }
}
