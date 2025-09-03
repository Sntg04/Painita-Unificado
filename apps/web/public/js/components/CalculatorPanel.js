export function CalculatorPanel({ monto, plazo, onMonto, onPlazo, onSolicitar }) {
  const wrap = document.createElement('div');
  wrap.className = 'card calc-card';
  wrap.innerHTML = `
  <h3 class="card__title">Calcula tu crédito</h3>
  <label class="field"><span class="field__label">¿Cuánto necesitas?</span>
      <input type="range" min="100000" max="1200000" step="10000" value="${monto}" class="slider" />
    </label>
  <div class="field__hint"><span class="field__label">Monto seleccionado:</span> <strong class="calc__monto">${Number(monto).toLocaleString()}</strong></div>
  <label class="field"><span class="field__label">¿En cuántos días?</span>
      <input type="range" min="8" max="120" step="1" value="${plazo}" class="slider plazo" />
    </label>
  <div class="field__hint"><span class="field__label">Plazo seleccionado:</span> <strong class="calc__plazo">${plazo} días</strong></div>
  <hr class="calc__divider" />
    <button class="btn btn-primary calc__cta">Solicitar Crédito</button>
  `;
  const montoEl = wrap.querySelector('.slider');
  const plazoEl = wrap.querySelector('.slider.plazo');
  const montoTxt = wrap.querySelector('.calc__monto');
  const plazoTxt = wrap.querySelector('.calc__plazo');
  function updateFill(el) {
    const min = Number(el.min || 0), max = Number(el.max || 100), val = Number(el.value || 0);
    const pct = ((val - min) / (max - min)) * 100;
    el.style.setProperty('--fill', pct + '%');
  }
  // init fill
  updateFill(montoEl); updateFill(plazoEl);
  montoEl.addEventListener('input', (e) => { const v = Number(e.target.value); montoTxt.textContent = v.toLocaleString(); updateFill(e.target); onMonto?.(v); });
  plazoEl.addEventListener('input', (e) => { const v = Number(e.target.value); plazoTxt.textContent = `${v} días`; updateFill(e.target); onPlazo?.(v); });
  wrap.querySelector('.calc__cta').addEventListener('click', () => onSolicitar?.());
  return wrap;
}
