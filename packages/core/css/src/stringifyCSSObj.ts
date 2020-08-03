export type Middleware = (key: string, value: any) => [string, any] | undefined;

export function stringifyCSSObj(obj: any, middlewareArr: Middleware[] = []) {
  let string = '';
  const keys = Object.keys(obj);
  for (let index = 0; index < keys.length; index++) {
    let key = keys[index];
    let cssFriendlyKey = key.replace(/([A-Z])/g, (matches) => `-${matches[0].toLowerCase()}`);
    let value = obj[key];

    // Apply middleware before we handle the value & key:
    for (let m = 0; m < middlewareArr.length; m++) {
      const middleware = middlewareArr[m];
      const newKeyAndValue = middleware(cssFriendlyKey, value);
      if (newKeyAndValue) {
        key = newKeyAndValue[0];
        value = newKeyAndValue[1];
      }
    }

    switch (typeof value) {
      case 'object': {
        string += `${cssFriendlyKey} {${stringifyCSSObj(value, middlewareArr)}}`;
        continue;
      }
      case 'number':
      case 'string': {
        string += `${cssFriendlyKey}:${value};`;
        continue;
      }
      default: {
        console.error(`Unsupported property value [${typeof value}]`);
      }
    }
  }
  return string;
}

export default stringifyCSSObj;
