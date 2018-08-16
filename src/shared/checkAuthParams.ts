export function checkAuthParameters(params: { [key: string]: string | undefined }): void {
  if (!params.clientId) {
    throw new Error('Please provide Client ID');
  }

  if (!params.clientSecret) {
    throw new Error('Please provide Client Secret');
  }

  if (!params.spreadsheetId) {
    throw new Error('Please provide spreadsheet ID');
  }

  if (!params.spreadsheetName) {
    throw new Error('Please provide spreadsheet name');
  }
}
