export type Constructor<T = any> = new (...args: any[]) => T;

export type MapToInstance<
  ConstructorTuple extends Constructor[],
  Result extends any[] = []
> = ConstructorTuple extends [infer First extends Constructor, ...infer Rest extends Constructor[]]
  ? MapToInstance<Rest, [...Result, InstanceType<First>]>
  : Result;
