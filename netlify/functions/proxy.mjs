export default async function handler(req, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  const url = new URL(req.url);
  const target = url.searchParams.get('target');

  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing ?target= parameter' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NetlifyProxy/1.0)' }
    });
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}
