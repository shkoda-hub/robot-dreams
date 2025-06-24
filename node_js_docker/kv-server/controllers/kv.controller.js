import {kvService} from '../services/kv.service.js';

class KvController {
  get = async (req, res) => {
    const key = req.params.key;

    const result = await kvService.get(key);
    return res.json(result);
  };

  set = async (req, res) => {
    const body = req.body;
    await kvService.set(body);
    res.json({ 'ok': true });
  };
}

export const kvController = new KvController();
