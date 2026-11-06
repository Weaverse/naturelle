declare class StorageFactory {
    storages: Map<string, MemoryStorage>;
    constructor();
    storage(namespace: string): MemoryStorage;
}
declare class MemoryStorage {
    private map;
    get<T = unknown>(key: string): Promise<T | null>;
    put<T = unknown>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    /**
     * Minimal implementation of KV list. Supports prefix filtering only.
     */
    list(options?: {
        prefix?: string;
    }): Promise<{
        keys: string[];
    }>;
}

export { StorageFactory };
