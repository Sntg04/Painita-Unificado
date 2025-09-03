export function FormStep1() {
  const wrap = document.createElement('div');
  wrap.className = 'form-grid';

  function group(labelText, el) {
    const g = document.createElement('label'); g.className = 'form-group';
    const lbl = document.createElement('div'); lbl.className = 'form-label'; lbl.textContent = labelText;
    g.append(lbl, el);
    return g;
  }

  function input(placeholder, cls, attrs={}) {
    const el = document.createElement('input'); el.className = 'input ' + (cls||''); el.placeholder = placeholder; Object.entries(attrs).forEach(([k,v])=> el.setAttribute(k,v)); return el;
  }

  // Aplica restricciones para campos de nombres: solo letras y máximo 15 caracteres
  function nameInput(placeholder, cls) {
    const el = input(placeholder, cls, { maxlength: '15', pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{1,15}$', title: 'Solo letras, máximo 15 caracteres' });
    const sanitize = (v) => v
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g, '') // elimina números, espacios y caracteres especiales
      .slice(0, 15);
    el.addEventListener('input', () => { const s = sanitize(el.value); if (el.value !== s) el.value = s; });
    // Evita espacio desde el teclado por UX
    el.addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); });
    return el;
  }

  function select(cls, options) {
    const el = document.createElement('select'); el.className = 'input ' + (cls||'');
    const empty = document.createElement('option'); empty.value = ''; empty.textContent = 'Selecciona...'; el.appendChild(empty);
    options.forEach(o => { const op = document.createElement('option'); op.value = o; op.textContent = o; el.appendChild(op); });
    return el;
  }

  // Helpers para fechas
  function toYMD(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }
  function parseYMD(v) { if (!v) return null; const [y,m,d] = v.split('-').map(n=>parseInt(n,10)); if (!y||!m||!d) return null; return new Date(y, m-1, d); }
  function addYears(d, years) { const nd = new Date(d.getTime()); nd.setFullYear(nd.getFullYear()+years); return nd; }

  // Campo numérico: solo dígitos, sin espacios ni caracteres especiales, longitud máxima configurable
  function numericInput(placeholder, cls, maxLen = 15) {
    const el = input(placeholder, cls, { inputmode: 'numeric', maxlength: String(maxLen), pattern: `^\\d{1,${maxLen}}$`, title: `Solo números (máximo ${maxLen})` });
    const sanitize = (v) => v.replace(/\D+/g, '').slice(0, maxLen);
    el.addEventListener('input', () => { const s = sanitize(el.value); if (s !== el.value) el.value = s; });
    el.addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); });
    return el;
  }

  // Correo: dividir en usuario + dominio con selector y mantener un input oculto "email"
  function emailComposite() {
    const row = document.createElement('div');
    row.style.display = 'flex'; row.style.gap = '8px'; row.style.alignItems = 'center';

  const user = input('usuario', 'email_local', { maxlength: '64', autocomplete: 'email' });
  user.dataset.aux = '1';
    user.style.flex = '1 1 55%';
    // Sanea: sin espacios ni @; permite letras/números/._+-
    const sanitizeUser = (v) => v.replace(/\s+/g, '').replace(/@/g, '').replace(/[^A-Za-z0-9._+\-]/g, '').slice(0, 64);
    user.addEventListener('input', () => { const s = sanitizeUser(user.value); if (s !== user.value) user.value = s; });

    const domainList = [
      '@gmail.com','@hotmail.com','@outlook.com','@live.com','@yahoo.com','@yahoo.es','@icloud.com',
      '@proton.me','@protonmail.com','@gmx.com','@aol.com','@zoho.com','@mail.com','@yopmail.com','@hotmail.es'
    ];
    const domainSel = document.createElement('select'); domainSel.className = 'input email_domain_select'; domainSel.style.flex = '1 1 45%';
    const mkOpt = (v,t=v) => { const o=document.createElement('option'); o.value=v; o.textContent=t; return o; };
    domainSel.appendChild(mkOpt('', 'Selecciona dominio…'));
    domainList.forEach(d => domainSel.appendChild(mkOpt(d)));
    domainSel.appendChild(mkOpt('otro', 'Otro dominio…'));

  const custom = input('@tu-dominio.com', 'email_domain_custom', { maxlength: '100' });
  custom.dataset.aux = '1';
    custom.style.flex = '1 1 45%'; custom.style.display = 'none';
    const sanitizeDomain = (v) => {
      let s = v.trim();
      if (!s.startsWith('@')) s = '@' + s.replace(/^@+/, '');
      s = s.replace(/\s+/g, '').replace(/[^A-Za-z0-9@._\-]/g, '');
      return s.slice(0, 100);
    };
    custom.addEventListener('input', () => { const s = sanitizeDomain(custom.value); if (s !== custom.value) custom.value = s; updateHidden(); });

    const hidden = input('', 'email', { type: 'hidden' });

    function updateHidden() {
      const local = user.value || '';
      let dom = '';
      if (domainSel.value === 'otro') dom = sanitizeDomain(custom.value || '');
      else dom = domainSel.value || '';
      hidden.value = local && dom ? (local + dom) : '';
    }

    user.addEventListener('input', updateHidden);
    domainSel.addEventListener('change', () => {
      const isOther = domainSel.value === 'otro';
      custom.style.display = isOther ? '' : 'none';
      if (!isOther) custom.value = '';
      updateHidden();
    });

    row.append(user, domainSel, custom, hidden);

    // Exponer un método para que el contenedor pueda hidratar este control
    row._hydrateEmail = (email) => {
      if (!email) { user.value=''; domainSel.value=''; custom.value=''; custom.style.display='none'; updateHidden(); return; }
      const parts = String(email).split('@');
      if (parts.length >= 2) {
        const local = parts.shift();
        const dom = '@' + parts.join('@');
        user.value = local || '';
        const found = Array.from(domainSel.options).map(o=>o.value).find(d => d.toLowerCase() === dom.toLowerCase());
        if (found) { domainSel.value = found; custom.style.display = 'none'; custom.value = ''; }
        else { domainSel.value = 'otro'; custom.style.display = ''; custom.value = dom; }
        updateHidden();
      }
    };

    return row;
  }

  // Campos según el schema del CRM
  const educationOptions = ['Sin estudios','Primaria','Secundaria','Técnico','Tecnólogo','Universitario','Posgrado'];
  const maritalOptions = ['Soltero(a)','Casado(a)','Unión libre','Divorciado(a)','Viudo(a)'];
  const genderOptions = ['Femenino','Masculino','Otro','Prefiero no decir'];

  // Inputs con referencias para control de fechas
  const birth = input('Fecha de nacimiento','birth_date',{ type:'date'});
  const issue = input('Fecha expedición','document_issue_date',{ type:'date'});
  // Limitar expedición máximo a hoy
  issue.setAttribute('max', toYMD(new Date()));
  function updateIssueMin() {
    const bd = parseYMD(birth.value);
    if (!bd) { issue.removeAttribute('min'); return; }
    const min = addYears(bd, 18);
    const minStr = toYMD(min);
    issue.setAttribute('min', minStr);
  }
  birth.addEventListener('change', updateIssueMin);
  // Inicializar límites al cargar
  updateIssueMin();

  wrap.append(
    group('Primer nombre', nameInput('Primer nombre','first_name')),
    group('Segundo nombre', nameInput('Segundo nombre','second_name')),
    group('Primer apellido', nameInput('Primer apellido','last_name')),
    group('Segundo apellido', nameInput('Segundo apellido','second_last_name')),
    group('Correo electrónico', emailComposite()),
    group('Número de documento', numericInput('Número de documento','document_number', 15)),
    group('Fecha de nacimiento', birth),
    group('Fecha expedición documento', issue),
    group('Nivel educativo', select('education_level', educationOptions)),
    group('Estado civil', select('marital_status', maritalOptions)),
    group('Género', select('gender', genderOptions)),
  );

  return wrap;
}
