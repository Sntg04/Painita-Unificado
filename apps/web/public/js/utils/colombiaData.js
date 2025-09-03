let _data = null;
let _loading = null;

async function fetchColombiaJson() {
  const url = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.json';
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('No se pudo cargar departamentos/ciudades');
  return r.json();
}

export async function ensureDataLoaded() {
  if (_data) return _data;
  if (_loading) return _loading;
  _loading = (async () => {
    try {
      const json = await fetchColombiaJson();
      _data = Array.isArray(json) ? json : [];
      return _data;
    } finally {
      _loading = null;
    }
  })();
  return _loading;
}

export function getDepartamentos() {
  return (_data || []).map(d => d.departamento);
}

export function getCiudades(departamento) {
  const dep = (_data || []).find(d => (d.departamento || '').toLowerCase() === String(departamento||'').toLowerCase());
  return dep?.ciudades || [];
}

export function isReady() { return !!_data; }
