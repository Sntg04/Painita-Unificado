import { ensureDataLoaded, getDepartamentos, getCiudades, isReady } from '../utils/colombiaData.js';

export function FormStep2() {
  const wrap = document.createElement('div');
  wrap.className = 'form-grid';

  function group(labelText, el) { const g = document.createElement('label'); g.className = 'form-group'; const lbl = document.createElement('div'); lbl.className = 'form-label'; lbl.textContent = labelText; g.append(lbl, el); return g; }

  function select(cls, options=[]) {
    const el = document.createElement('select'); el.className = 'input ' + (cls||'');
    const empty = document.createElement('option'); empty.value=''; empty.textContent='Selecciona...'; el.appendChild(empty);
    options.forEach(o => { const op=document.createElement('option'); op.value=o; op.textContent=o; el.appendChild(op); });
    return el;
  }
  function input(placeholder, cls, attrs={}) { const el=document.createElement('input'); el.className='input '+(cls||''); el.placeholder=placeholder; Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; }

  // Solo letras (incluye acentos/Ñ/Ü), sin espacios ni especiales, máximo 15
  function lettersOnlyInput(placeholder, cls, maxLen=15) {
    const el = input(placeholder, cls, { maxlength: String(maxLen), pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{1,15}$', title: `Solo letras, máximo ${maxLen} caracteres` });
    const sanitize = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g, '').slice(0, maxLen);
    el.addEventListener('input', () => { const s = sanitize(el.value); if (s !== el.value) el.value = s; });
    el.addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); });
    return el;
  }

  const depSel = select('department');
  const citySel = select('city');
  const locInput = lettersOnlyInput('Localidad - Barrio','locality');
  const addrInput = input('Dirección','address');

  depSel.addEventListener('change', () => {
    const dep = depSel.value;
    const cities = dep ? getCiudades(dep) : [];
    citySel.innerHTML = '';
    const empty = document.createElement('option'); empty.value=''; empty.textContent='Selecciona...'; citySel.appendChild(empty);
    cities.forEach(c => { const op = document.createElement('option'); op.value=c; op.textContent=c; citySel.appendChild(op); });
  });

  wrap.append(
    group('Departamento', depSel),
    group('Ciudad', citySel),
    group('Localidad - Barrio', locInput),
    group('Dirección', addrInput),
  );

  // Cargar data si no está lista
  if (!isReady()) {
    ensureDataLoaded().then(() => {
      // poblar departamentos
      depSel.innerHTML = '';
      const empty = document.createElement('option'); empty.value=''; empty.textContent='Selecciona...'; depSel.appendChild(empty);
      getDepartamentos().forEach(d => { const op=document.createElement('option'); op.value=d; op.textContent=d; depSel.appendChild(op); });
    }).catch(() => {
      // si falla, degradar a inputs libres
      const depInput = input('Departamento','department');
      const cityInput = input('Ciudad','city');
      wrap.replaceChildren(
        group('Departamento', depInput),
        group('Ciudad', cityInput),
        group('Localidad - Barrio', locInput),
        group('Dirección', addrInput),
      );
    });
  } else {
    // si ya está, poblar de una
    getDepartamentos().forEach(d => { const op=document.createElement('option'); op.value=d; op.textContent=d; depSel.appendChild(op); });
  }

  return wrap;
}
