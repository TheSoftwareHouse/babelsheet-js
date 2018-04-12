declare module 'json-mask' {
  type IJsonMask = (a: any, b: any) => any;

  const jsonMask: IJsonMask;

  export = jsonMask;
}
