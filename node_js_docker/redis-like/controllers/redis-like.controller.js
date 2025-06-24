import {redisLikeService} from '../services/redis-like.service.js';

class RedisLikeController {
  set = async (req, res) =>  {
    const { key, value } = req.body;

    await redisLikeService.set({ key, value });
    await res.json({ 'ok': true });
  };

  get = async (req, res) =>  {
    const key  = req.query.key || undefined;
    if (!key) {
      await res.status(400).json({ error: 'key required' });
    }

    const result = await redisLikeService.get(key);
    await res.json(result);
  };
}

export const controller = new RedisLikeController();
