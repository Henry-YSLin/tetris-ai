export type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;

export type Subtract<T, U> = T & Exclude<T, U>;