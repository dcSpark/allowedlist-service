import NodeCache from "node-cache";
import { requestWrapper } from "../utils";

export type CacheOption = {
    key: CacheKeys;
    method: () => unknown;
};

export enum CacheKeys {
    STARGATE = "STARGATE",
    TOKEN_REGISTRY = "TOKEN_REGISTRY",
    FULL_ALLOWED_LIST = "FULL_ALLOWED_LIST",
}

// updating mechanics:
// query sidechain every n seconds and update cache for each request
// in the meantime allow access to current state of cache and allow to query it, even while the update happens
export class CacheManager {
    cacheStore: NodeCache;

    constructor(secondsTTL?: number) {
        this.cacheStore = new NodeCache({
            stdTTL: secondsTTL ?? 0,
            useClones: false,
        });
    }

    public updateCache = async (actions: CacheOption[]) => {
        for (let action of actions) {
            console.log(`Updating ${action.key}`);
            const result = await requestWrapper(action.method);
            this.save(action.key, result);
        }
    };

    public keepCached = async (actions: CacheOption[], intervalMs: number = 20000): Promise<void> => {
        await this.updateCache(actions); // load first time - setInterval runs then scheduled jobs and first one starts after intervalMs
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setInterval(async () => {
            await this.updateCache(actions);
        }, intervalMs);
    };

    public save(key: string, item: unknown): void {
        console.log(`saving to cache... key: ${key}`);
        this.cacheStore.set(key, item);
    }

    public async get(key: string): Promise<unknown | null> {
        console.log(`getting from cache... key: ${key}`);
        const value = await this.cacheStore.get(key);
        if (value) return value;
        return null;
    }

    public delete(keys: string[]): void {
        this.cacheStore.del(keys);
    }

    public flush(): void {
        console.log("Resetting cache...");
        this.cacheStore.flushAll();
    }
}

export const cacheManager = new CacheManager();
