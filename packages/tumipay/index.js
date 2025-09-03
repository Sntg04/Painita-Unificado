export function buildPaymentLink({ id, amount, installment }) {
  // TODO: Replace with real Tumipay API call
  return `https://tumipay.mock/pay?ref=${encodeURIComponent(id)}&amount=${encodeURIComponent(amount)}&installment=${encodeURIComponent(installment)}`;
}

export async function createTumipayPayment({ id, amount, installment, apiKey, apiBase }) {
  // Placeholder for real API integration
  return { link: buildPaymentLink({ id, amount, installment }) };
}
