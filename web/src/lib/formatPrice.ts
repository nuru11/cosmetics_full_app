export function formatPrice(amount: number, decimals = 2): string {
  return `ETB ${amount.toFixed(decimals)}`;
}
