const formatToExtension: { [key: string]: string } = {
  json: 'json',
  // ios: 'strings',
  // android: 'xml',
  // xml: 'xml'
};

export function doesFormatExists(format: string): boolean {
  const formats = Object.keys(formatToExtension);
  return !!formats.find(f => f === format);
}

export function getExtension(format: string): string {
  return formatToExtension[format];
}
