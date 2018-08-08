const formatToExtension: { [key: string]: string } = {
  json: 'json',
  // ios: 'strings',
  // android: 'xml',
  // xml: 'xml'
};

export function getExtension(format: string): string {
  const extension = formatToExtension[format];
  if (!extension) {
    throw new Error(`Not possible to create translations for format '${format}'`);
  }

  return extension;
}
