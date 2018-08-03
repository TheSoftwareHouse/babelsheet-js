import { ILogger } from 'node-common';

export default class Formatter {
  constructor(private logger: ILogger) {}

  private formatJson(): void {
    this.logger.info('Formating JSON');
  }

  private formatXML(): void {
    this.logger.info('Formating XML');
  }

  public format(formatType: string): void {
    switch (formatType) {
      case 'xml':
        this.formatXML();
        break;
      case 'json':
      default:
        this.formatJson();
        break;
    }
  }
}
