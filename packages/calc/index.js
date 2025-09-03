export function calcularValorPrestamo(monto, plazoMeses, tasaAnualPercent) {
  // Convierte tasa anual porcentual a tasa mensual decimal
  const r = tasaAnualPercent / 100 / 12;
  const n = plazoMeses;
  if (r === 0) return monto / n;
  const factor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round((monto * factor) * 100) / 100; // redondeo a centavos
}
