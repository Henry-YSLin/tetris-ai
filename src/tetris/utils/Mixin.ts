/* eslint-disable */
export type Constructor<T = {}> = new (...args: any[]) => T;

export type Subtract<T, U> = T & Exclude<T, U>;

export type MixinArgs = any[];