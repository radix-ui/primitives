export function normalize(fileName: string) {
  return fileName.split('\\').join('/');
}
