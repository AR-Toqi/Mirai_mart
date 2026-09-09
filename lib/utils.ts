export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}

export function getColorHex(colorName: string): string {
  const lower = colorName.toLowerCase().trim();
  const map: Record<string, string> = {
    blue: "#0A98C3",
    "sky blue": "#71D7F6",
    "pastel blue": "#71D7F6",
    cyan: "#06B6D4",
    indigo: "#4F46E5",
    teal: "#0D9488",
    yellow: "#FCE35F",
    gold: "#FCE35F",
    amber: "#F59E0B",
    "sunflower yellow": "#FCE35F",
    wood: "#D4A373",
    "natural wood": "#D4A373",
    natural: "#D4A373",
    beige: "#E9D8A6",
    "warm beige": "#E9D8A6",
    cream: "#F4F1DE",
    brown: "#6F4E37",
    "earth brown": "#6F4E37",
    green: "#22C55E",
    mint: "#A7F3D0",
    "mint green": "#A7F3D0",
    olive: "#606C38",
    sage: "#84A98C",
    coral: "#FF6F61",
    "warm coral": "#FF6F61",
    pink: "#F43F5E",
    "pastel pink": "#FFB5A7",
    rose: "#F43F5E",
    red: "#EF4444",
    crimson: "#DC2626",
    ruby: "#BE123C",
    white: "#FFFFFF",
    "pure white": "#FFFFFF",
    black: "#191C1E",
    charcoal: "#4A4E69",
    "charcoal black": "#191C1E",
    "charcoal gray": "#4A4E69",
    purple: "#9D4EDD",
    lavender: "#C084FC",
    violet: "#8B5CF6",
    orange: "#F77F00",
    peach: "#FFD166",
    gray: "#64748B",
    grey: "#64748B",
    silver: "#94A3B8",
  };
  if (map[lower]) return map[lower];
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(lower)) return lower;
  return "#0A98C3";
}
