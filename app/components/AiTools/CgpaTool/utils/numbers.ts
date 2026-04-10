export function parseNumberLoose(raw: string) {
  const v = Number(String(raw ?? "").trim());
  return Number.isFinite(v) ? v : null;
}

export function clampMin(value: number, min: number) {
  return value < min ? min : value;
}

export function roundTo(value: number, decimals: number) {
  const p = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * p) / p;
}

export function formatGpaMaybe(value: number | null) {
  if (value === null) return "—";
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(2);
}

