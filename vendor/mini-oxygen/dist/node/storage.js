class StorageFactory {
  storages;
  constructor() {
    this.storages = /* @__PURE__ */ new Map();
  }
  storage(namespace) {
    let storage = this.storages.get(namespace);
    if (storage) return storage;
    this.storages.set(namespace, storage = new MemoryStorage());
    return storage;
  }
}
class MemoryStorage {
  map = /* @__PURE__ */ new Map();
  async get(key) {
    const value = this.map.get(key);
    return value ?? null;
  }
  async put(key, value) {
    this.map.set(key, value);
  }
  async delete(key) {
    this.map.delete(key);
  }
  /**
   * Minimal implementation of KV list. Supports prefix filtering only.
   */
  async list(options = {}) {
    const keys = [...this.map.keys()].filter(
      (k) => options.prefix ? k.startsWith(options.prefix) : true
    );
    return { keys };
  }
}
export {
  StorageFactory
};
