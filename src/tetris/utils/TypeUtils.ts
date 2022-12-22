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
 * Create an object type with all properties of T set to optional.
 */
export type OptionalFieldsOf<T> = {
  [Key in keyof T as Key extends string ? Uncapitalize<Key> : Key]?: T[Key] extends (...args: any) => any
    ? never
    : T[Key];
};
