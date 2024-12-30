// Extend the global Array interface
declare global {
  interface Array<T> {
    groupBy<K extends string | number | symbol>(
      keyGetter: (item: T) => K
    ): Record<K, T[]>;
  }
}

// Add the polyfill if it doesn't exist
if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function <T, K extends string | number | symbol>(
    this: T[],
    keyGetter: (item: T) => K
  ): Record<K, T[]> {
    return this.reduce((result, item) => {
      const key = keyGetter(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {} as Record<K, T[]>);
  };
}

export {}; // Ensure this file is treated as a module
