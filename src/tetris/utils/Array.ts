/* eslint-disable no-extend-native */
export {};
declare global {
  interface Array<T> {
    max(this: Array<T>): T;
    maxBy<TReturn>(this: Array<T>, iterator: (item: T) => TReturn): T;
    min(this: Array<T>): T;
    minBy<TReturn>(this: Array<T>, iterator: (item: T) => TReturn): T;
    sum(this: Array<number>): number;
  }
}

if (!Array.prototype.max) {
  Object.defineProperty(Array.prototype, 'max', {
    enumerable: false,
    writable: false,
    configurable: false,
    value<T>(this: Array<T>): T {
      let len = this.length;
      let max = this[this.length - 1];
      while (len--) {
        if (this[len] >= max) {
          max = this[len];
        }
      }
      return max;
    },
  });
}

if (!Array.prototype.maxBy) {
  Object.defineProperty(Array.prototype, 'maxBy', {
    enumerable: false,
    writable: false,
    configurable: false,
    value<T, TKey>(this: Array<T>, iterator: (item: T) => TKey): T {
      let len = this.length;
      let max: TKey = iterator(this[this.length - 1]);
      let maxItem: T = this[this.length - 1];

      while (len--) {
        const tmp: TKey = iterator(this[len]);
        if (tmp >= max) {
          max = tmp;
          maxItem = this[len];
        }
      }
      return maxItem;
    },
  });
}

if (!Array.prototype.min) {
  Object.defineProperty(Array.prototype, 'min', {
    enumerable: false,
    writable: false,
    configurable: false,
    value<T>(this: Array<T>): T {
      let len = this.length;
      let min = this[this.length - 1];
      while (len--) {
        if (this[len] <= min) {
          min = this[len];
        }
      }
      return min;
    },
  });
}

if (!Array.prototype.minBy) {
  Object.defineProperty(Array.prototype, 'minBy', {
    enumerable: false,
    writable: false,
    configurable: false,
    value<T, TKey>(this: Array<T>, iterator: (item: T) => TKey): T {
      let len = this.length;
      let min: TKey = iterator(this[this.length - 1]);
      let minItem: T = this[this.length - 1];

      while (len--) {
        const tmp: TKey = iterator(this[len]);
        if (tmp <= min) {
          min = tmp;
          minItem = this[len];
        }
      }
      return minItem;
    },
  });
}

if (!Array.prototype.sum) {
  Object.defineProperty(Array.prototype, 'sum', {
    enumerable: false,
    writable: false,
    configurable: false,
    value(this: Array<number>): number {
      return this.reduce((prev, curr) => prev + curr, 0);
    },
  });
}
