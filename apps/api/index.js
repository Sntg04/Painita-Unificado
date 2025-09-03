import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { calcularValorPrestamo } from '@painita/calc';
import { CRMClient } from '@painita/crm-client';
import { createTumipayPayment } from '@painita/tumipay';

const app = express();
app.use(cors());
app.use(bodyParser.json());

function resolveCrmBase() {
  if (process.env.CRM_BASE) return process.env.CRM_BASE;
  if (process.env.CRM_HOSTPORT) return `http://${process.env.CRM_HOSTPORT}`;
  if (process.env.CRM_HOST && process.env.CRM_PORT) return `http://${process.env.CRM_HOST}:${process.env.CRM_PORT}`;
  return 'http://localhost:4001';
}
const CRM_BASE = resolveCrmBase();
const crm = new CRMClient(CRM_BASE);

app.get('/', (req, res) => res.json({ ok: true }));
app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/start', async (req, res) => {
  const d = await crm.createSolicitud(req.body);
  res.json(d);
});

app.patch('/sync/:id/step', async (req, res) => {
  const d = await crm.syncStep(req.params.id, req.body);
  res.json(d);
});

app.post('/decision/:id', async (req, res) => {
  const d = await crm.decision(req.params.id, req.body);
  res.json(d);
});

app.post('/payment/:id', async (req, res) => {
  const { monto, plazoMeses, tasa } = req.body;
  const cuota = calcularValorPrestamo(monto, plazoMeses, tasa);
  const { link } = await createTumipayPayment({ id: req.params.id, amount: monto, installment: cuota, apiKey: process.env.TUMIPAY_KEY, apiBase: process.env.TUMIPAY_BASE });
  res.json({ link, cuota });
});

const PORT = process.env.PORT || 4002;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`API running on http://${HOST}:${PORT}`));
