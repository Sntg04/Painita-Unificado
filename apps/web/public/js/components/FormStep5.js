export function FormStep5() {
  const wrap = document.createElement('div'); wrap.className='form-grid';
  function group(labelText, el) { const g=document.createElement('label'); g.className='form-group'; const l=document.createElement('div'); l.className='form-label'; l.textContent=labelText; g.append(l,el); return g; }
  function input(placeholder, cls, attrs={}) { const el=document.createElement('input'); el.className='input '+(cls||''); el.placeholder=placeholder; Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; }
  function numericInput(placeholder, cls, maxLen=30) {
    const el = input(placeholder, cls, { inputmode:'numeric', maxlength: String(maxLen), pattern: `^\\d{1,${maxLen}}$`, title: `Solo números (máximo ${maxLen})` });
    const sanitize = (v) => v.replace(/\D+/g, '').slice(0, maxLen);
    el.addEventListener('input', () => { const s = sanitize(el.value); if (s !== el.value) el.value = s; });
    el.addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); });
    return el;
  }
  const banks = [
    'Bancolombia',
    'Banco de Bogotá',
    'Banco de Occidente',
    'Banco Popular',
    'Banco AV Villas',
    'BBVA',
    'Davivienda',
    'Scotiabank Colpatria',
    'Itaú',
    'Banco Caja Social',
    'Banco Agrario',
    'Banco GNB Sudameris',
    'Banco Pichincha',
    'Banco Falabella',
    'Banco Finandina',
    'Banco Serfinanza',
    'Banco W',
    'Bancamía',
    'Banco Mundo Mujer',
    'Banco Cooperativo Coopcentral',
    'Citibank Colombia',
    'Lulo Bank',
    'Nu (Nu Colombia)',
    // SEDPE / billeteras
    'Nequi',
    'Daviplata',
    'Movii',
    'Dale!',
    'Coink',
    'Powwi',
    'A la mano',
    'RappiPay',
    'Otro'
  ];
  function select(cls, options) { const el=document.createElement('select'); el.className='input '+(cls||''); const empty=document.createElement('option'); empty.value=''; empty.textContent='Selecciona...'; el.appendChild(empty); options.forEach(o=>{const op=document.createElement('option'); op.value=o; op.textContent=o; el.appendChild(op);}); return el; }
  wrap.append(
    group('Banco', select('bank_name', banks)),
  group('Número de cuenta', numericInput('Número de cuenta','account_number', 30)),
  group('Confirmar número de cuenta', numericInput('Confirmar','account_number_confirm', 30)),
  );
  return wrap;
}
