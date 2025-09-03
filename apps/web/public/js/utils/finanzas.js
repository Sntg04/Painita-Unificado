// Utilidades financieras (copian la lógica de la página original)
export const EA = 0.23;            // 23% E.A.
export const seguroRate = 0.00449; // 0,449%
export const ADMIN_FIJO = 33000;
export const ivaRate = 0.19;

export const getTarifaBaseFianza = (capital) => {
  if (capital <= 200000) return 0.14;
  if (capital <= 300000) return 0.12;
  if (capital <= 400000) return 0.11;
  return 0.1059;
};

export const formatCurrency = (value) =>
  (value ?? 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function calcularDesglose(monto, plazoDias) {
  const interesEA = monto * (Math.pow(1 + EA, plazoDias / 365) - 1);
  const seguro = monto * seguroRate;
  const fianza = monto * getTarifaBaseFianza(monto) * 1.19; // incluye IVA de fianza
  const administracion = ADMIN_FIJO;
  const ivaAdministracion = administracion * ivaRate;
  const totalPagar = monto + interesEA + seguro + fianza + administracion + ivaAdministracion;
  return { monto, interesEA, seguro, fianza, administracion, ivaAdministracion, totalPagar };
}
