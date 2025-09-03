export function FormStep4() {
  const wrap = document.createElement('div'); wrap.className='form-grid';
  function group(labelText, el) { const g=document.createElement('label'); g.className='form-group'; const l=document.createElement('div'); l.className='form-label'; l.textContent=labelText; g.append(l,el); return g; }
  function input(placeholder, cls, attrs={}) { const el=document.createElement('input'); el.className='input '+(cls||''); el.placeholder=placeholder; Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; }
  const relationOptions = ['Familiar','Amigo','Compañero de trabajo','Vecino'];
  function select(cls, options) { const el=document.createElement('select'); el.className='input '+(cls||''); const empty=document.createElement('option'); empty.value=''; empty.textContent='Selecciona...'; el.appendChild(empty); options.forEach(o=>{const op=document.createElement('option'); op.value=o; op.textContent=o; el.appendChild(op);}); return el; }

  // Helpers de validación
  function nameWithSpaces(placeholder, cls, maxLen=40) {
    const el = input(placeholder, cls, { maxlength: String(maxLen), pattern: `^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{1,${maxLen}}$`, title: `Solo letras y espacios (máximo ${maxLen})` });
    const sanitize = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü ]/g, '').slice(0, maxLen);
    el.addEventListener('input', () => { const s = sanitize(el.value); if (s !== el.value) el.value = s; });
    return el;
  }
  function phoneDigits(placeholder, cls, maxLen=10) {
    const el = input(placeholder, cls, { inputmode:'numeric', maxlength: String(maxLen), pattern: `^\\d{1,${maxLen}}$`, title: `Solo números (máximo ${maxLen})` });
    const sanitize = (v) => v.replace(/\D+/g, '').slice(0, maxLen);
    el.addEventListener('input', () => { const s = sanitize(el.value); if (s !== el.value) el.value = s; });
    el.addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); });
    return el;
  }

  wrap.append(
    group('Relación (Referencia 1)', select('reference_one_relationship', relationOptions)),
    group('Nombre (Referencia 1)', nameWithSpaces('Nombre','reference_one_name', 40)),
    group('Teléfono (Referencia 1)', phoneDigits('Teléfono','reference_one_phone', 10)),
    group('Relación (Referencia 2)', select('reference_two_relationship', relationOptions)),
    group('Nombre (Referencia 2)', nameWithSpaces('Nombre','reference_two_name', 40)),
    group('Teléfono (Referencia 2)', phoneDigits('Teléfono','reference_two_phone', 10)),
  );
  return wrap;
}
