import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import { calcularValorPrestamo } from '@painita/calc';
import { CRMClient } from '@painita/crm-client';
import { createTumipayPayment } from '@painita/tumipay';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import twilio from 'twilio';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// Avoid favicon 404 noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

const CRM_BASE = process.env.CRM_BASE || 'http://localhost:4001';
const crm = new CRMClient(CRM_BASE);

// OTP: Solo Twilio Verify

// Dev bypass: if OTP_BYPASS=1 or DEV_OTP_CODE is set, we'll skip Twilio Verify and accept a fixed code.
function isDevOtpEnabled() {
  return process.env.OTP_BYPASS === '1' || !!process.env.DEV_OTP_CODE;
}
function getDevOtpCode() {
  const raw = (process.env.DEV_OTP_CODE || '123456').toString();
  const digits = raw.replace(/\D/g, '');
  // ensure 6 digits (pad or slice)
  if (!digits) return '123456';
  return (digits + '000000').slice(0, 6);
}

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  try { return twilio(sid, token); } catch { return null; }
}

function getVerifyServiceSid() {
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID || process.env.TWILIO_SERVICE_SID;
  if (!sid || !/^VA[a-z0-9]+/i.test(sid)) return null;
  return sid;
}

function normalizePhone(input) {
  const raw = String(input||'').trim();
  if (raw.startsWith('+')) return raw; // asumimos E.164 válido del cliente
  const digits = raw.replace(/\D/g,'');
  if (digits.length === 10) {
    const cc = process.env.DEFAULT_COUNTRY_CODE || '+57';
    return cc + digits;
  }
  // fallback simple: si tiene 11 y empieza por 1, asumimos +1
  if (digits.length === 11 && digits.startsWith('1')) return '+1' + digits.slice(1);
  return '+' + digits; // último recurso
}

// Send OTP SMS
app.post('/otp/send', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error:'invalid_phone' });
    const full = normalizePhone(phone);
    if (isDevOtpEnabled()) {
      const code = getDevOtpCode();
      console.log(`[otp/mock] sending code ${code} to ${full}`);
      return res.json({ ok: true, status: 'mocked' });
    }
    const client = getTwilioClient();
    const verifySid = getVerifyServiceSid();
    if (!client || !verifySid) return res.status(500).json({ error:'twilio_verify_not_configured' });

    const svc = client.verify.v2.services(verifySid);
    const resp = await svc.verifications.create({ to: full, channel: 'sms' });
    return res.json({ ok: true, status: resp.status });
  } catch (e) {
    console.error('[otp] send error:', e);
    res.status(500).json({ error:'send_failed', code: e?.code, status: e?.status, message: e?.message || String(e) });
  }
});

// Verify OTP
app.post('/otp/verify', async (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) return res.status(400).json({ error:'invalid_input' });
    const full = normalizePhone(phone);
    if (isDevOtpEnabled()) {
      if (String(code).trim() === getDevOtpCode()) return res.json({ ok: true });
      return res.status(400).json({ error: 'invalid_otp', reason: 'mock_code_mismatch' });
    }
    const client = getTwilioClient();
    const verifySid = getVerifyServiceSid();
    if (!client || !verifySid) return res.status(500).json({ error:'twilio_verify_not_configured' });

    const svc = client.verify.v2.services(verifySid);
    const resp = await svc.verificationChecks.create({ to: full, code: String(code).trim() });
    if (resp.status === 'approved') return res.json({ ok:true });
    return res.status(400).json({ error:'invalid_otp', reason: resp.status });
  } catch (e) {
    console.error('[otp] verify error:', e);
    res.status(500).json({ error:'verify_failed', code: e?.code, status: e?.status, message: e?.message || String(e) });
  }
});

// friendly route for static pages
function resolveLegacyDir(base) {
  if (!base || !fs.existsSync(base)) return null;
  const candidates = [
    '',
    'dist',
    'build',
    path.join('client','dist'),
    path.join('client','build'),
    'public'
  ];
  for (const rel of candidates) {
    const dir = path.join(base, rel);
    const indexPath = path.join(dir, 'index.html');
    if (fs.existsSync(indexPath)) return dir;
  }
  return null;
}

const LEGACY_BASE = process.env.LEGACY_WEB_DIR;
const LEGACY_DIR = resolveLegacyDir(LEGACY_BASE);

// Optional adapter script to expose a simple API client in window
app.get('/adapter.js', (req, res) => {
  res.type('application/javascript').send(`(function(){
    function createSync(base){
      const key='painita_solicitud_id';
      const getId=()=>localStorage.getItem(key);
      const setId=(id)=>localStorage.setItem(key,String(id));
      return {
        start: async ({phone,otp,password})=>{
          const r=await fetch(base+'/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,otp,password})});
          const d=await r.json(); setId(d.id); return d;
        },
        sync: async (stepKey,data,finalFlag)=>{
          const id=getId(); if(!id) throw new Error('no solicitud id');
          const r=await fetch(base+'/sync/'+id+'/step',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stepKey,data,final:!!finalFlag})});
          return r.json();
        },
        getId
      };
    }
    window.PainitaFormSync=createSync(location.origin);
  })();`);
});

// If LEGACY dir is set, serve it with optional adapter injection
if (LEGACY_DIR) {
  console.log('[web] Serving legacy UI from:', LEGACY_DIR);
  app.use(express.static(LEGACY_DIR));
  app.get('/', (req, res, next) => {
    const indexPath = path.join(LEGACY_DIR, 'index.html');
    if (!fs.existsSync(indexPath)) return next();
    if (process.env.LEGACY_INJECT_ADAPTER === '1') {
      try {
        let html = fs.readFileSync(indexPath, 'utf8');
        html = html.replace('</head>', '<script src="/adapter.js"></script></head>');
        res.type('html').send(html);
        return;
      } catch(e) { /* fall back */ }
    }
    res.sendFile(indexPath);
  });
  // SPA fallback: serve index.html for non-API routes without extension
  app.get('*', (req, res, next) => {
    const isApi = req.path.startsWith('/start') || req.path.startsWith('/sync') || req.path.startsWith('/payment') || req.path.startsWith('/status') || req.path.startsWith('/adapter.js');
    const hasExt = path.extname(req.path);
    if (!isApi && !hasExt && req.headers.accept && req.headers.accept.includes('text/html')) {
      const indexPath = path.join(LEGACY_DIR, 'index.html');
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}
app.get('/mi-solicitud', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mi-solicitud.html'));
});

// Check if phone exists (proxy to CRM)
app.get('/phone/exists', async (req, res) => {
  try {
    const phone = String(req.query.phone||'').trim();
    if (!phone) return res.status(400).json({ error: 'phone required' });
    const r = await fetch(`${CRM_BASE}/clientes/exists?phone=${encodeURIComponent(phone)}`);
    const d = await r.json();
    res.status(r.status).json(d);
  } catch (e) {
    res.status(502).json({ error: 'bad_gateway', message: 'No se pudo contactar al CRM' });
  }
});

// Crear solicitud (después de teléfono+otp+password)
app.post('/start', async (req, res) => {
  const { phone, otp, password, monto, plazo } = req.body;
  const data = await crm.createSolicitud({ phone, otp, password, monto, plazo });
  res.json(data);
});

// Sincronizar paso
app.patch('/sync/:id/step', async (req, res) => {
  const { stepKey, data, final } = req.body;
  const d = await crm.syncStep(req.params.id, { stepKey, data, final });
  res.json(d);
});

// Obtener estado de una solicitud (proxy al CRM)
app.get('/status/:id', async (req, res) => {
  try {
    const d = await crm.getSolicitud(req.params.id);
    res.json(d);
  } catch (e) {
    res.status(502).json({ error: 'bad_gateway', message: String(e) });
  }
});

// Obtener estado de una solicitud (proxy al CRM)
app.get('/status/:id', async (req, res) => {
  try {
    const d = await crm.getSolicitud(req.params.id);
    res.json(d);
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

// Formularios proxy
app.post('/form/start', async (req, res) => {
  try {
    const { phone, monto, plazo, password } = req.body || {};
    const r = await fetch(`${CRM_BASE}/formularios/start`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone, monto, plazo, password }) });
    const d = await r.json();
    console.log('[web] /form/start → CRM', r.status);
    res.status(r.status).json(d);
  } catch (e) {
    console.error('[web] /form/start proxy error:', e?.message || e);
    res.status(502).json({ error:'bad_gateway', message: 'No se pudo contactar al CRM' });
  }
});
app.patch('/form/:id/step', async (req, res) => {
  try {
    const { step, data } = req.body || {};
    const r = await fetch(`${CRM_BASE}/formularios/${encodeURIComponent(req.params.id)}/step`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ step, data }) });
    const d = await r.json();
    console.log('[web] /form/:id/step → CRM', r.status);
    res.status(r.status).json(d);
  } catch (e) {
    console.error('[web] /form/:id/step proxy error:', e?.message || e);
    res.status(502).json({ error:'bad_gateway', message: 'No se pudo contactar al CRM' });
  }
});
app.get('/form/:id', async (req, res) => {
  try {
    const r = await fetch(`${CRM_BASE}/formularios/${encodeURIComponent(req.params.id)}`);
    const d = await r.json();
    console.log('[web] GET /form/:id → CRM', r.status);
    res.status(r.status).json(d);
  } catch (e) {
    console.error('[web] GET /form/:id proxy error:', e?.message || e);
    res.status(502).json({ error:'bad_gateway', message: 'No se pudo contactar al CRM' });
  }
});

// Proxy CRM health
app.get('/crm/health', async (req, res) => {
  try {
    const r = await fetch(`${CRM_BASE}/health`);
    const d = await r.json();
    res.status(r.status).json(d);
  } catch (e) {
    res.status(502).json({ error:'bad_gateway', message:'No se pudo contactar al CRM' });
  }
});

// Generar link de pago Tumipay (mock)
app.post('/payment-link/:id', async (req, res) => {
  const { id } = req.params;
  const { monto, plazoMeses, tasa } = req.body;
  const cuota = calcularValorPrestamo(monto, plazoMeses, tasa);
  const { link } = await createTumipayPayment({ id, amount: monto, installment: cuota, apiKey: process.env.TUMIPAY_KEY, apiBase: process.env.TUMIPAY_BASE });
  res.json({ link, cuota });
});

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Web demo server running on http://${HOST}:${PORT}`))
  .on('error', (err) => {
    console.error('[web] listen error:', err.code || err.message);
    process.exit(1);
  });

process.on('uncaughtException', (e) => console.error('[web] uncaughtException', e));
process.on('unhandledRejection', (e) => console.error('[web] unhandledRejection', e));
