import fetch from 'node-fetch';

export class CRMClient {
  constructor(base) {
    this.base = base.replace(/\/$/, '');
  }
  async createSolicitud({ phone, otp, password, monto, plazo }) {
    const r = await fetch(`${this.base}/solicitudes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone, otp, password, monto, plazo }) });
    return r.json();
  }
  async syncStep(id, { stepKey, data, final = false }) {
    const r = await fetch(`${this.base}/solicitudes/${id}/step`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ stepKey, data, final }) });
    return r.json();
  }
  async decision(id, { decision, amount }) {
    const r = await fetch(`${this.base}/solicitudes/${id}/decision`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ decision, amount }) });
    return r.json();
  }
  async getSolicitud(id) {
    const r = await fetch(`${this.base}/solicitudes/${id}`);
    return r.json();
  }
  async listSolicitudes() {
    const r = await fetch(`${this.base}/solicitudes`);
    return r.json();
  }
}
