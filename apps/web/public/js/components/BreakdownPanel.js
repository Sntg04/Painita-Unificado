import { formatCurrency } from '../utils/finanzas.js';

export function BreakdownPanel({ desglose }) {
  const { monto, interesEA, seguro, fianza, administracion, ivaAdministracion, totalPagar } = desglose;
  const inner = document.createElement('div');
  inner.className = 'breakdown-inner';
  inner.innerHTML = `
    <h3 class="card__title">Desglose del crédito</h3>
    <div class="row between"><span>Valor solicitado</span><strong>${formatCurrency(monto)}</strong></div>
    <div class="row between"><span>Interés (23% E.A.)</span><strong>${formatCurrency(interesEA)}</strong></div>
    <div class="row between"><span>Seguro</span><strong>${formatCurrency(seguro)}</strong></div>
    <div class="row between"><span>Fianza FGA + IVA</span><strong>${formatCurrency(fianza)}</strong></div>
    <div class="row between"><span>Administración</span><strong>${formatCurrency(administracion)}</strong></div>
    <div class="row between"><span>IVA</span><strong>${formatCurrency(ivaAdministracion)}</strong></div>
    <hr/>
    <div class="row between total"><span>Total a pagar</span><strong>${formatCurrency(totalPagar)}</strong></div>
  `;
  return inner;
}
