import { createClient } from 'redis';

const KEY = 'meal-planner-profiles';
const DEFAULT = ['Laurie & Sylvie'];

export default async function handler(req, res) {
  const client = createClient({ url: process.env.REDIS_URL });
  try {
    await client.connect();
    if (req.method === 'GET') {
      const raw = await client.get(KEY);
      res.status(200).json(raw ? JSON.parse(raw) : DEFAULT);
    } else if (req.method === 'POST') {
      await client.set(KEY, JSON.stringify(req.body));
      res.status(200).json({ ok: true });
    } else {
      res.status(405).end();
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await client.disconnect();
  }
}
