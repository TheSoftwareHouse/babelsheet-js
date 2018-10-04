import ITransformer from './transformer';

export default class SpreadsheetToYamlTransformer implements ITransformer {
  private readonly supportedType = 'yml';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToYaml: ITransformer,
    private jsonToJsonMasked: ITransformer
  ) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    {
      langCode,
      mergeLanguages,
      filters,
    }: {
      langCode?: string;
      mergeLanguages?: boolean;
      filters?: string[];
    } = {}
  ): string | object[] {
    const json = this.spreadsheetToJson.transform(source, { langCode });
    const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });

    if (mergeLanguages || langCode) {
      return this.jsonToYaml.transform(jsonMasked);
    }

    return Object.keys(jsonMasked).map(langName => {
      const yamlTranslations = this.jsonToYaml.transform(jsonMasked[langName]);
      return { lang: langName, content: yamlTranslations };
    });
  }
}
