import ITransformer from './transformer';

export default class SpreadsheetToYamlTransformer implements ITransformer {
  private readonly supportedType = 'yml';

  constructor(
    private spreadsheetToJson: ITransformer, 
    private jsonToYaml: ITransformer,
    private jsonToJsonMasked: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    langCode?: string,
    mergeLanguages?: boolean,
    filters?: string[],    
  ): string | object[] {
    let json = this.spreadsheetToJson.transform(source, langCode);
    json = this.jsonToJsonMasked.transform(json, undefined, undefined, filters);
    
    if (mergeLanguages || langCode) {
      return this.jsonToYaml.transform(json);
    }

    return Object.keys(json).map(langName => {
      const yamlTranslations = this.jsonToYaml.transform(json[langName]);
      return { lang: langName, content: yamlTranslations };
    });
  }
}
