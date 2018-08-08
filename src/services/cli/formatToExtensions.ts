const formatToExtension: { [key: string]: string } = {
  json: 'json',
  // ios: 'strings',
  // android: 'xml',
  // xml: 'xml'
};

export function formatExists(format: string): boolean {
  const formats = Object.keys(formatToExtension);
  return !!formats.find(f => f === format);
}

export function getExtension(format: string): string | null {
  if (formatExists(format)) {
    return formatToExtension[format];
  }
  return null;
}
