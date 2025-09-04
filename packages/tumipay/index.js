async function getFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try { const mod = await import('node-fetch'); return mod.default; } catch { throw new Error('fetch_unavailable'); }
}

export function buildPaymentLink({ id, amount, installment }) {
  // Fallback mock URL
  return `https://tumipay.mock/pay?ref=${encodeURIComponent(id)}&amount=${encodeURIComponent(amount)}&installment=${encodeURIComponent(installment||0)}`;
}

function pick(obj, keys) { const out = {}; keys.forEach(k => { if (obj && obj[k] != null) out[k] = obj[k]; }); return out; }

export async function createTumipayPayment({ id, amount, installment, apiKey, apiBase, username, password }) {
  const base = apiBase || process.env.TUMIPAY_BASE;
  const token = apiKey || process.env.TUMIPAY_KEY || process.env.TUMIPAY_TOKEN;
  const user = username || process.env.TUMIPAY_USER;
  const pass = password || process.env.TUMIPAY_PASS;
  // If no config, return mock
  if (!base) return { link: buildPaymentLink({ id, amount, installment }) };

  const f = await getFetch();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  else if (user && pass) headers['Authorization'] = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

  // Candidate endpoints and response parsers
  const endpoints = [
    { path: '/payment-links', body: (p)=>({ reference: p.id, amount: p.amount, currency: 'COP', description: 'Pago préstamo Painita', metadata: { installment: p.installment } }), pick: (d)=> d?.link || d?.url || d?.payment_url },
    { path: '/transactions/payment-link', body: (p)=>({ reference: p.id, amount: p.amount, currency: 'COP', description: 'Pago préstamo Painita', channel: 'LINK' }), pick: (d)=> d?.data?.link || d?.data?.url || d?.link },
    { path: '/create-payment-link', body: (p)=>({ reference: p.id, amount: p.amount, currency: 'COP', description: 'Pago préstamo Painita' }), pick: (d)=> d?.link }
  ];
  const payload = { id: String(id), amount: Number(amount||0), installment: Number(installment||0) };
  for (const ep of endpoints) {
    try {
      const url = String(base).replace(/\/$/,'') + ep.path;
      const r = await f(url, { method: 'POST', headers, body: JSON.stringify(ep.body(payload)) });
      const d = await r.json().catch(()=>({}));
      if (!r.ok) continue;
      const link = ep.pick(d);
      if (link) return { link };
    } catch {}
  }
  // Base configurada pero no se pudo obtener link
  throw new Error('tumipay_link_failed');
}
