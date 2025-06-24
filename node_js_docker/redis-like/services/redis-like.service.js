class RedisLikeService {
  #storage;

  constructor() {
    this.#storage = new Map();
  }

  async set({ key, value }) {
    this.#storage.set(key, value);
  }

  async get(key) {
    const value = this.#storage.get(key);
    return {
      key,
      value: value ?? null,
    };
  }
}

export const redisLikeService = new RedisLikeService();
