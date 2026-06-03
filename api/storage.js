import { createClient } from 'redis';

const DEFAULT_DATA = {
  recipes: [], pantry: [], weeks: {}, settings: { mealsPerWeek: 5, avoidWeeks: 2 },
  shoppingTicked: {}, shoppingRestocked: {}, cookedMeals: {}
};

function profileKey(profile) {
  const safe = (profile || 'default').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 64);
  return `meal-planner-${safe}`;
}

export default async function handler(req, res) {
  const key = profileKey(req.query.profile);
  const client = createClient({ url: process.env.REDIS_URL });
  try {
    await client.connect();
    if (req.method === 'GET') {
      const raw = await client.get(key);
      res.status(200).json(raw ? JSON.parse(raw) : DEFAULT_DATA);
    } else if (req.method === 'POST') {
      await client.set(key, JSON.stringify(req.body));
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
