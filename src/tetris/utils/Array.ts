export {};
declare global {
  interface Array<T>  {
    max(this: Array<T>): T;
    maxBy(this: Array<T>, iterator: <TReturn>(item: T) => TReturn): T;
    min(this: Array<T>): T;
    minBy(this: Array<T>, iterator: <TReturn>(item: T) => TReturn): T;
  }
}

if (!Array.prototype.max) {
  Object.defineProperty(Array.prototype, 'max', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function<T>(this: Array<T>): T {
      let len = this.length, max = this[0];
      while (len--) {
        if (this[len] > max) {
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
    value: function<T, TKey>(this: Array<T>, iterator: <TKey>(item: T) => TKey): T {
      let len = this.length;
      let max: TKey = iterator(this[0]);
      let maxItem: T = this[0];

      while (len--) {
        const tmp: TKey = iterator(this[len]);
        if (tmp > max) {
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
    value: function<T>(this: Array<T>): T {
      let len = this.length, min = this[0];
      while (len--) {
        if (this[len] < min) {
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
    value: function<T, TKey>(this: Array<T>, iterator: <TKey>(item: T) => TKey): T {
      let len = this.length;
      let min: TKey = iterator(this[0]);
      let minItem: T = this[0];

      while (len--) {
        const tmp: TKey = iterator(this[len]);
        if (tmp < min) {
          min = tmp;
          minItem = this[len];
        }
      }
      return minItem;
    },
  });
}