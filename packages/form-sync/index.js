export function createSyncClient({ base = 'http://localhost:4000', storage = globalThis?.localStorage }) {
  const key = 'painita_solicitud_id';
  function getId() { try { return storage?.getItem(key); } catch { return null; } }
  function setId(id) { try { storage?.setItem(key, String(id)); } catch {}
  }
  return {
    async start({ phone, otp, password }) {
      const r = await fetch(base + '/start', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone, otp, password }) });
      const d = await r.json(); setId(d.id); return d;
    },
    getId,
    async sync(stepKey, data, { final = false } = {}) {
      const id = getId(); if (!id) throw new Error('no solicitud id');
      const r = await fetch(base + `/sync/${id}/step`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ stepKey, data, final }) });
      return r.json();
    }
  };
}
