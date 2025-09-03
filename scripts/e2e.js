import fetch from 'node-fetch';

async function main() {
  const web = process.env.WEB || 'http://localhost:4000';
  const crm = process.env.CRM || 'http://localhost:4001';

  const start = await fetch(web + '/start', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone:'3001234567', otp:'1234', password:'secret' }) }).then(r=>r.json());
  console.log('Created:', start);
  const id = start.id;

  const s1 = await fetch(web + `/sync/${id}/step`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ stepKey:'personal', data:{ name:'Juan' } }) }).then(r=>r.json());
  console.log('Step1:', s1.status);
  const fin = await fetch(web + `/sync/${id}/step`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ stepKey:'final', data:{ ok:true }, final:true }) }).then(r=>r.json());
  console.log('Final:', fin.status);

  const approved = await fetch(crm + `/solicitudes/${id}/decision`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ decision:'approve', amount:1500000 }) }).then(r=>r.json());
  console.log('Decision:', approved.status, 'Amount:', approved.amount);

  const payment = await fetch(web + `/payment-link/${id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ monto:1500000, plazoMeses:12, tasa:24 }) }).then(r=>r.json());
  console.log('Payment:', payment);
}

main().catch(e => { console.error(e); process.exit(1); });
