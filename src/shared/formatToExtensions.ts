const formatToExtension: { [key: string]: string } = {
  android: 'xml',
  ios: 'strings',
  json: 'json',
};

export function getExtension(format: string): string {
  const extension = formatToExtension[format];
  if (!extension) {
    throw new Error(`Not possible to create translations for format '${format}'`);
  }

  return extension;
}

const extensionsFromJson: { [key: string]: { [key: string]: string } } = {
  android: { extension: 'json-xml', documentType: 'application/xml' },
  ios: { extension: 'json-ios-strings', documentType: 'text/plain' },
  json: { extension: 'json', documentType: 'application/json' },
};

export function getExtensionsFromJson(format: string): string {
  const details = extensionsFromJson[format];
  if (!details) {
    throw new Error(`Not possible to create translations for format '${format}'`);
  }

  return details.extension;
}

export function getDocumentType(format: string): string {
  const details = extensionsFromJson[format];
  if (!details) {
    throw new Error(`Not possible to create translations for format '${format}'`);
  }

  return details.documentType;
}
