export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}
