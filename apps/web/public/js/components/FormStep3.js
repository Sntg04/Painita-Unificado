export function FormStep3() {
  const wrap = document.createElement('div'); wrap.className='form-grid';
  function group(labelText, el) { const g=document.createElement('label'); g.className='form-group'; const l=document.createElement('div'); l.className='form-label'; l.textContent=labelText; g.append(l,el); return g; }
  function input(placeholder, cls, attrs={}) { const el=document.createElement('input'); el.className='input '+(cls||''); el.placeholder=placeholder; Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; }

  const employmentOptions = ['Empleado','Independiente','Pensionado','Desempleado'];
  const cycleOptions = ['Semanal','Quincenal','Mensual','Bimestral'];
  // Rango de ingresos: solo "Mayor a $X" hasta $5.000.000
  const incomeOptions = [
    'Mayor a $1.000.000',
    'Mayor a $2.000.000',
    'Mayor a $3.000.000',
    'Mayor a $4.000.000',
    'Mayor a $5.000.000'
  ];

  function select(cls, options) { const el=document.createElement('select'); el.className='input '+(cls||''); const empty=document.createElement('option'); empty.value=''; empty.textContent='Selecciona...'; el.appendChild(empty); options.forEach(o=>{const op=document.createElement('option'); op.value=o; op.textContent=o; el.appendChild(op);}); return el; }

  wrap.append(
    group('Situación laboral', select('employment_status', employmentOptions)),
    group('Ciclo de pago', select('payment_cycle', cycleOptions)),
    group('Rango de ingresos', select('income_range', incomeOptions)),
  );
  return wrap;
}
