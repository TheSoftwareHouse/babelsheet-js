const formatToExtension: { [key: string]: string } = {
  json: 'json',
  xml: 'xml',
  android: 'xml',
  ios: 'strings',
};

export function getExtension(format: string): string {
  const extension = formatToExtension[format];
  if (!extension) {
    throw new Error(`Not possible to create translations for format '${format}'`);
  }

  return extension;
}

const extensionsFromJson: { [key: string]: string } = {
  xml: 'json-xml',
  android: 'json-xml',
  ios: 'json-ios-strings',
  json: 'json',
};

export function getExtensionsFromJson(format: string): string {
  return extensionsFromJson[format];
}
