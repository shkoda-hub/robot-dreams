import config from '../config/config.js';

const { redisUrl } = config;

class KVService {
  async get(key) {
    const response = await fetch(`${redisUrl}/get?key=${key}`);
    return await response.json();
  }

  async set(payload) {
    await fetch(
      `${redisUrl}/set`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  }
}

export const kvService = new KVService();
