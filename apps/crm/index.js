import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { calcularValorPrestamo } from '@painita/calc';
import { init, createSolicitud, updateStep, listSolicitudes, setDecision, getSolicitud as getSol, isPgEnabled, startFormularioForPhone, updateFormularioStep, getFormulario, phoneExists, getCounts, recentClientes, recentFormularios, loginCliente, loginAdmin, listUsuarios, createClient, updateClient, deleteClient, createUser, updateUser, deleteUser } from './db.js';
import crypto from 'crypto';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Note: static is registered AFTER our friendly routes so they take precedence
app.get('/favicon.ico', (req, res) => res.status(204).end());

// friendly routes
app.get('/', (req, res) => {
  // Principal: login
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/index.html', (req, res) => {
  // Forzar que index.html también muestre el login
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/admin', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/admin.html', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/asesor', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'asesor.html'));
});
app.get('/asesor.html', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'asesor.html'));
});
app.get('/login.html', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/details/:id', (req, res) => {
  res.redirect(`/details.html?id=${encodeURIComponent(req.params.id)}`);
});

// Static assets (images, css, js). Keep after route handlers above.
// Disable automatic index file serving for directory requests.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Simple cookie-based auth for admin
function signToken(payload) {
  const secret = process.env.ADMIN_JWT_SECRET || 'dev-secret';
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(data).toString('base64') + '.' + sig;
}
function verifyToken(token) {
  try {
    const [b64, sig] = String(token||'').split('.');
    const data = Buffer.from(b64, 'base64').toString('utf8');
    const secret = process.env.ADMIN_JWT_SECRET || 'dev-secret';
    const expected = crypto.createHmac('sha256', secret).update(data).digest('hex');
    if (sig !== expected) return null;
    return JSON.parse(data);
  } catch { return null; }
}
function parseCookies(req) {
  const h = req.headers.cookie || '';
  const out = {};
  h.split(';').forEach(kv => { const i = kv.indexOf('='); if (i>0) out[kv.slice(0,i).trim()] = decodeURIComponent(kv.slice(i+1)); });
  return out;
}
function requireAdmin(req, res, next) {
  const cookies = parseCookies(req);
  const tok = cookies['admin_token'];
  const user = verifyToken(tok);
  if (!user) return res.status(401).send('Unauthorized');
  req.admin = user; next();
}

app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok:false, error:'email_password_required' });
    const u = await loginAdmin({ email, password });
    const tok = signToken({ id: u.id, email: u.email, role: u.role, ts: Date.now() });
    res.setHeader('Set-Cookie', `admin_token=${encodeURIComponent(tok)}; Path=/; HttpOnly; SameSite=Lax`);
    res.json({ ok:true, user: u });
  } catch (e) {
    res.status(e.status||500).json({ ok:false, error: e.message || 'login_failed' });
  }
});

// Who am I (role discovery for UI redirects)
app.get('/me', (req, res) => {
  const cookies = parseCookies(req);
  const tok = cookies['admin_token'];
  const user = verifyToken(tok);
  if (!user) return res.status(401).json({ ok:false, error:'unauthorized' });
  res.json({ ok:true, user: { id: user.id, email: user.email, role: user.role } });
});

// Check if phone exists (cliente ya registrado)
app.get('/clientes/exists', async (req, res) => {
  try {
    const phone = String(req.query.phone||'').trim();
    if (!phone) return res.status(400).json({ error: 'phone required' });
    const exists = await phoneExists(phone);
    res.json({ exists });
  } catch (e) { res.status(500).json({ error: 'server_error' }); }
});

// Crear nueva solicitud a partir de teléfono/otp/password
app.post('/solicitudes', async (req, res) => {
  try {
  const { phone, otp, password, monto, plazo } = req.body || {};
  if (!phone || !otp || !password) return res.status(400).json({ error: 'phone, otp, password required' });
  // Basic OTP format validation: 6 numeric digits
  const otpOk = typeof otp === 'string' || typeof otp === 'number' ? String(otp).replace(/\D/g,'').length === 6 : false;
  if (!otpOk) return res.status(400).json({ error: 'invalid_otp' });
  const s = await createSolicitud({ phone, otp, password, monto, plazo });
    res.json(s);
  } catch (e) { res.status(e.status||500).json({ error: e.message }); }
});

// Actualizar paso (sincronizar)
app.patch('/solicitudes/:id/step', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { stepKey, data, final } = req.body || {};
    if (!stepKey) return res.status(400).json({ error: 'stepKey required' });
    const s = await updateStep(id, { stepKey, data, final });
    res.json(s);
  } catch (e) { res.status(e.status||500).json({ error: e.message }); }
});

// Listar solicitudes
app.get('/solicitudes', async (req, res) => {
  const list = await listSolicitudes();
  res.json(list);
});

// Aprobar/Rechazar
app.post('/solicitudes/:id/decision', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { decision, amount } = req.body || {};
    const s = await setDecision(id, { decision, amount });
    res.json(s);
  } catch (e) { res.status(e.status||500).json({ error: e.message }); }
});

// Obtener una solicitud
app.get('/solicitudes/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const s = await getSol(id);
    res.json(s);
  } catch (e) { res.status(e.status||404).json({ error: 'not found' }); }
});

// Iniciar formulario (después de crear cliente)
app.post('/formularios/start', async (req, res) => {
  try {
    const { phone, monto, plazo, password } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'phone required' });
    const f = await startFormularioForPhone({ phone, monto, plazo, password });
    res.json(f);
  } catch (e) { res.status(e.status||500).json({ error: e.message }); }
});

// Guardar paso del formulario
app.patch('/formularios/:id/step', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { step, data } = req.body || {};
    if (typeof step !== 'number') return res.status(400).json({ error: 'step required' });
    const f = await updateFormularioStep(id, { step, data });
    res.json(f);
  } catch (e) { res.status(e.status||500).json({ error: e.message }); }
});

// Obtener formulario
app.get('/formularios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const f = await getFormulario(id);
    res.json(f);
  } catch (e) { res.status(e.status||404).json({ error: 'not found' }); }
});

// Health check + counts for debugging
app.get('/health', async (req, res) => {
  try {
    const counts = await getCounts();
    res.json({ ok: true, ...counts });
  } catch (e) { res.status(500).json({ ok:false, error: 'health_failed' }); }
});

// Basic root for Render
app.get('/__up', (req, res) => res.json({ ok: true }));

// Admin data for quick inspection
app.get('/admin/data', requireAdmin, async (req, res) => {
  try {
    const [counts, clientes, forms, usuarios] = await Promise.all([
      getCounts(),
      recentClientes(50),
      recentFormularios(50),
      listUsuarios(50)
    ]);
    res.json({ ok:true, counts, clientes, formularios: forms, usuarios });
  } catch (e) { res.status(500).json({ ok:false, error: 'admin_data_failed' }); }
});

// Admin CRUD: Clientes (usuarios web)
app.post('/admin/clients', requireAdmin, async (req, res) => {
  try { const out = await createClient(req.body||{}); res.json({ ok:true, client: out }); }
  catch (e) { res.status(e.status||500).json({ ok:false, error: e.message||'create_failed' }); }
});
app.patch('/admin/clients/:id', requireAdmin, async (req, res) => {
  try { const out = await updateClient(req.params.id, req.body||{}); res.json({ ok:true, client: out }); }
  catch (e) { res.status(e.status||500).json({ ok:false, error: e.message||'update_failed' }); }
});
app.delete('/admin/clients/:id', requireAdmin, async (req, res) => {
  try { const out = await deleteClient(req.params.id); res.json({ ok:true, ...out }); }
  catch (e) { res.status(e.status||500).json({ ok:false, error: e.message||'delete_failed' }); }
});

// Admin CRUD: Usuarios (staff)
app.post('/admin/users', requireAdmin, async (req, res) => {
  try { const out = await createUser(req.body||{}); res.json({ ok:true, user: out }); }
  catch (e) { res.status(e.status||500).json({ ok:false, error: e.message||'create_failed' }); }
});
app.patch('/admin/users/:id', requireAdmin, async (req, res) => {
  try { const out = await updateUser({ id: req.params.id, ...req.body }); res.json({ ok:true, user: out }); }
  catch (e) { res.status(e.status||500).json({ ok:false, error: e.message||'update_failed' }); }
});
app.delete('/admin/users/:id', requireAdmin, async (req, res) => {
  try { const out = await deleteUser(req.params.id); res.json({ ok:true, ...out }); }
  catch (e) { res.status(e.status||500).json({ ok:false, error: e.message||'delete_failed' }); }
});

// Cliente login (simple)
app.post('/clientes/login', async (req, res) => {
  try {
    const { phone, password } = req.body || {};
    if (!phone || !password) return res.status(400).json({ error: 'phone_password_required' });
    const out = await loginCliente({ phone, password });
    res.json({ ok:true, ...out });
  } catch (e) {
    res.status(e.status||500).json({ ok:false, error: e.message || 'login_failed' });
  }
});

// Cálculo de cuota (misma calculadora usada en la web)
app.post('/calc', (req, res) => {
  const { monto, plazoMeses, tasa } = req.body;
  const cuota = calcularValorPrestamo(Number(monto||0), Number(plazoMeses||0), Number(tasa||0));
  res.json({ cuota });
});

init().then(() => {
  console.log('[crm] storage:', isPgEnabled() ? 'Postgres' : 'JSON file');
  const PORT = process.env.PORT || 4001;
  const HOST = '0.0.0.0';
  app.listen(PORT, HOST, () => console.log(`CRM running on http://${HOST}:${PORT}`));
}).catch(err => {
  console.error('[crm] init error', err);
  process.exit(1);
});
