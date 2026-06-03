import { kv } from '@vercel/kv';
 
const KEY = 'meal-planner-data';
 
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await kv.get(KEY);
      res.status(200).json(data || {
        recipes: [], pantry: [], weeks: {}, settings: { mealsPerWeek: 5, avoidWeeks: 2 },
        shoppingTicked: {}, shoppingRestocked: {}, cookedMeals: {}
      });
    } else if (req.method === 'POST') {
      await kv.set(KEY, req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(405).end();
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
