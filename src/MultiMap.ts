/**
 * @summary Map-like data structure allowing multiple
 *          values per key
 */
export class MultiMap<K, V> {
    private map: Map<K, V[]> = new Map<K, V[]>();

    /**
     * @summary Get all values indexed by key. Throws
     *          when key is not present in the Map
     */
    get(key: K) {
        const currentValues = this.map.get(key);
        if (!currentValues) {
            throw new Error(
                `MultiMap: No values found for key "${key}". Did you mean to use MultiMap#has?`,
            );
        }

        return currentValues;
    }

    /**
     * @summary Check if provided key exists in the Map
     */
    has(key: K) {
        return this.map.has(key);
    }

    /**
     * @summary Set a new value for a key.
     */
    set(key: K, value: V) {
        const currentValues = this.map.get(key) ?? [];

        if (!currentValues.length) {
            // Set default array for new keys
            this.map.set(key, currentValues);
        }

        currentValues.push(value);
        return this;
    }

    [Symbol.iterator]() {
        return this.map.entries();
    }
}
