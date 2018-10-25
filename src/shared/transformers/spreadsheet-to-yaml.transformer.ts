import ITransformer, { ITranslationsData } from './transformer';

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

  public transform(source: ITranslationsData): ITranslationsData {
    const json = this.spreadsheetToJson.transform(source);
    const jsonMasked = this.jsonToJsonMasked.transform(json);
    return this.jsonToYaml.transform(jsonMasked);
  }
}
