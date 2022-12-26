/**
 * Get the constructor type of an abstract/concrete class type.
 */
export type Constructor<T = any> = abstract new (...args: any[]) => T;

/**
 * Get the instance type of an concrete class type.
 */
export type ConcreteConstructor<T = any> = new (...args: any[]) => T;

/**
 * Maps a tuple of constructor types to a tuple of instance types.
 */
export type MapToInstance<
  ConstructorTuple extends Constructor[],
  Result extends any[] = []
> = ConstructorTuple extends [infer First extends Constructor, ...infer Rest extends Constructor[]]
  ? MapToInstance<Rest, [...Result, InstanceType<First>]>
  : Result;

/**
 * Create an object type with all non-method properties of T.
 */
export type FieldsOf<T> = {
  [Key in keyof T as Key extends string
    ? T[Key] extends (...args: any) => any
      ? never
      : Uncapitalize<Key>
    : Key]: T[Key];
};
