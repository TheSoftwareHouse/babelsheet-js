import { ILogger } from 'node-common';
import ITransformer from '../../shared/transformers/transformer';

export default class Formatter {
  constructor(private jsonTransformer: ITransformer, private logger: ILogger) {}

  public format(spreadsheetData: any, formatType: string) {
    switch (formatType) {
      case 'xml':
        return this.formatToXML();
      case 'json':
      default:
        return this.formatToJson(spreadsheetData);
    }
  }

  private async formatToJson(spreadsheetData: any): Promise<any> {
    this.logger.info('Formating JSON');

    const transformedData = await this.jsonTransformer.transform(spreadsheetData);

    return JSON.stringify(transformedData);
  }

  private async formatToXML(): Promise<string> {
    this.logger.info('Formating XML');

    return 'xml';
  }
}
