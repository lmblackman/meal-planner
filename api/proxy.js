module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key found', env: Object.keys(process.env) });
  res.status(200).json({ keyFound: true, keyPreview: key.slice(0, 10) + '...' });
}
