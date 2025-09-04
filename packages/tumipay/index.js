async function getFetch() {
  if (typeof fetch !== 'undefined') return fetch;
  try { const mod = await import('node-fetch'); return mod.default; } catch { throw new Error('fetch_unavailable'); }
}

export function buildPaymentLink({ id, amount, installment }) {
  // Fallback mock URL
  return `https://tumipay.mock/pay?ref=${encodeURIComponent(id)}&amount=${encodeURIComponent(amount)}&installment=${encodeURIComponent(installment||0)}`;
}

function pick(obj, keys) { const out = {}; keys.forEach(k => { if (obj && obj[k] != null) out[k] = obj[k]; }); return out; }

export async function createTumipayPayment({ id, amount, installment, apiKey, apiBase, username, password, customer, returnUrl, cancelUrl, notifyUrl, paymentMethod }) {
  const base = apiBase || process.env.TUMIPAY_BASE;
  const token = apiKey || process.env.TUMIPAY_KEY || process.env.TUMIPAY_TOKEN;
  const user = username || process.env.TUMIPAY_USER;
  const pass = password || process.env.TUMIPAY_PASS;
  const tokenTop = process.env.TUMIPAY_TOKEN_TOP;
  const authorization = process.env.TUMIPAY_AUTH || process.env.TUMIPAY_AUTHORIZATION;
  const payinPath = process.env.TUMIPAY_PAYIN_PATH || '/api/v1/payin';
  // If no config, return mock
  if (!base) return { link: buildPaymentLink({ id, amount, installment }) };

  const f = await getFetch();
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  // Some Tumipay deployments expect Bearer, others X-Api-Key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Api-Key'] = token;
  }
  else if (user && pass) headers['Authorization'] = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
  // Specific headers for PayIn (per docs): Authorization + Token-Top
  if (authorization) headers['Authorization'] = authorization;
  if (tokenTop) headers['Token-Top'] = tokenTop;

  // Candidate endpoints and response parsers
  const endpoints = [
    // Specific PayIn endpoint from docs
    { path: payinPath, body: (p)=>({
      reference: p.id,
      amount: p.amount,
      currency: 'COP',
      payment_method: p.paymentMethod || 'ALL_METHODS',
      description: 'Pago préstamo Painita',
      redirect_url: p.returnUrl,
      ipn_url: p.notifyUrl,
      customer_data: p.customer ? ({
        legal_doc: p.customer.document?.number,
        legal_doc_type: p.customer.document?.type || 'CC',
        phone_code: p.customer.phone_code,
        phone_number: p.customer.phone_number,
        email: p.customer.email,
        full_name: p.customer.name
      }) : undefined
    }), pick: (d)=> d?.data?.url_payment || d?.url_payment || d?.payment_url || d?.data?.payment_url || d?.link },
    // Initiate a Pay-In (as per docs): often returns redirect/payment URL
    { path: '/payins/initiate', body: (p)=>({
      merchantReference: p.id,
      reference: p.id,
      amount: { currency: 'COP', value: p.amount },
      currency: 'COP',
      channel: 'LINK',
      customer: p.customer ? ({
        name: p.customer.name,
        email: p.customer.email,
        phone: p.customer.phone,
        document: p.customer.document ? ({ type: p.customer.document.type || 'CC', number: p.customer.document.number }) : undefined
      }) : undefined,
      redirectUrls: (p.returnUrl || p.cancelUrl) ? ({ returnUrl: p.returnUrl, cancelUrl: p.cancelUrl }) : undefined,
      callbackUrl: p.notifyUrl,
      metadata: { installment: p.installment }
    }), pick: (d)=> d?.redirectUrl || d?.redirect_url || d?.data?.redirectUrl || d?.data?.redirect_url || d?.paymentUrl || d?.payment_url || d?.url },
    { path: '/connect/payins/initiate', body: (p)=>({ merchantReference: p.id, reference: p.id, amount: { currency: 'COP', value: p.amount }, currency: 'COP', channel: 'LINK', redirectUrls: (p.returnUrl || p.cancelUrl) ? ({ returnUrl: p.returnUrl, cancelUrl: p.cancelUrl }) : undefined, callbackUrl: p.notifyUrl, metadata: { installment: p.installment } }), pick: (d)=> d?.redirectUrl || d?.redirect_url || d?.data?.redirectUrl || d?.data?.redirect_url || d?.paymentUrl || d?.payment_url || d?.url },
    { path: '/api/payins/initiate', body: (p)=>({ merchantReference: p.id, reference: p.id, amount: { currency: 'COP', value: p.amount }, currency: 'COP', channel: 'LINK', redirectUrls: (p.returnUrl || p.cancelUrl) ? ({ returnUrl: p.returnUrl, cancelUrl: p.cancelUrl }) : undefined, callbackUrl: p.notifyUrl, metadata: { installment: p.installment } }), pick: (d)=> d?.redirectUrl || d?.redirect_url || d?.data?.redirectUrl || d?.data?.redirect_url || d?.paymentUrl || d?.payment_url || d?.url },
    { path: '/payment-links', body: (p)=>({ reference: p.id, amount: p.amount, currency: 'COP', description: 'Pago préstamo Painita', metadata: { installment: p.installment } }), pick: (d)=> d?.link || d?.url || d?.payment_url },
    { path: '/transactions/payment-link', body: (p)=>({ reference: p.id, amount: p.amount, currency: 'COP', description: 'Pago préstamo Painita', channel: 'LINK' }), pick: (d)=> d?.data?.link || d?.data?.url || d?.link },
    { path: '/create-payment-link', body: (p)=>({ reference: p.id, amount: p.amount, currency: 'COP', description: 'Pago préstamo Painita' }), pick: (d)=> d?.link }
  ];
  const payload = { id: String(id), amount: Number(amount||0), installment: Number(installment||0) };
  for (const ep of endpoints) {
    try {
      const url = String(base).replace(/\/$/,'') + ep.path;
  const r = await f(url, { method: 'POST', headers, body: JSON.stringify(ep.body({ ...payload, customer, returnUrl, cancelUrl, notifyUrl })) });
  // Si hay redirección, usar Location
  const loc = r.headers && (r.headers.get ? r.headers.get('location') : (r.headers.Location || r.headers.location));
  if (loc) return { link: loc };
  const d = await r.json().catch(()=>({}));
  if (!r.ok) continue;
  const link = ep.pick(d);
      if (link) return { link };
    } catch (err) {
      // preserve last error detail
      var lastErr = err;
    }
  }
  // Base configurada pero no se pudo obtener link
  const e = new Error('tumipay_link_failed'); e.cause = lastErr; throw e;
}
