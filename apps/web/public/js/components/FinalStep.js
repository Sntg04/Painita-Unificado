export function FinalStep({ totalPagar, celular, solicitudId }) {
  const wrap = document.createElement('div');
  wrap.className = 'card card-center';
  wrap.innerHTML = `
    <h3 class="card__title">🎉 Cuenta creada exitosamente. Puedes continuar al pago.</h3>
    <div class="row">
      <button class="btn btn-primary pagar">Generar link de pago</button>
    </div>
    <div class="row"><span>Link:</span> <a class="plink" target="_blank"></a></div>
    <div class="row"><span>Cuota:</span> <span class="cuota"></span></div>
  `;
  const payBtn = wrap.querySelector('.pagar');
  const linkA = wrap.querySelector('.plink');
  const cuotaEl = wrap.querySelector('.cuota');
  const API = location.origin;
  payBtn.addEventListener('click', async () => {
    if (!solicitudId) { alert('No hay solicitud'); return; }
    const body = { monto: Math.round(totalPagar), plazoMeses: 12, tasa: 24 };
    const r = await fetch(`${API}/payment-link/${solicitudId}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const d = await r.json();
    linkA.textContent = d.link; linkA.href = d.link; cuotaEl.textContent = d.cuota;
  });
  return wrap;
}
