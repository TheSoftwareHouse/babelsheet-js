import { ILogger } from 'node-common';
import ITransformer from '../../shared/transformers/transformer';

export default class Formatter {
  constructor(private jsonTransformer: ITransformer, private logger: ILogger) {}

  private async formatToJson(spreadsheetData: any) {
    this.logger.info('Formating JSON');

    const transformedData = await this.jsonTransformer.transform(spreadsheetData);

    return JSON.stringify(transformedData);
  }

  private async formatToXML(spreadsheetData: any) {
    this.logger.info('Formating XML');

    return await Promise.resolve('xml');
  }

  public format(spreadsheetData: any, formatType: string) {
    switch (formatType) {
      case 'xml':
        return this.formatToXML(spreadsheetData);
      case 'json':
      default:
        return this.formatToJson(spreadsheetData);
    }
  }
}
