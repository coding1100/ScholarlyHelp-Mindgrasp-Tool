/**
 * Shared styling for Description section main heading (used by Description.tsx).
 * Renders part of the heading in orange (#F56200) and adds line breaks:
 * - If heading contains ":", text after the colon goes on the next line (in orange).
 * - If no ":", text starting with "from" goes on the next line (in orange).
 */

const ORANGE_CLASS = "text-[#F56200]";

/**
 * Styles the description main heading with line breaks and orange emphasis:
 * - If there is ":", the text after ":" is shown on the next line in orange.
 * - If there is no ":" but there is "from", "from" and the rest go on the next line in orange.
 */
export function styleDescriptionMainHeading(text: string): string {
  if (!text || typeof text !== "string") return "";

  const trimmed = text.trim();

  // Case: heading contains ":" — text after colon goes on next line (in orange)
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex !== -1) {
    const beforeColon = trimmed.slice(0, colonIndex).trim();
    const afterColon = trimmed.slice(colonIndex + 1).trim();
    return `${escapeHtml(beforeColon)}:<br /><span class="${ORANGE_CLASS}">${escapeHtml(afterColon)}</span>`;
  }

  // Case: no ":" — find " from " (case-insensitive) and put "from" + rest on next line (in orange)
  const fromRegex = /\s+from\s+/i;
  const fromMatch = trimmed.match(fromRegex);
  if (fromMatch) {
    const matchStart = trimmed.search(fromRegex);
    const beforeFrom = trimmed.slice(0, matchStart).trim();
    const fromAndRest = trimmed.slice(matchStart).trim(); // "from ..."
    return `${escapeHtml(beforeFrom)}<br /><span class="${ORANGE_CLASS}">${escapeHtml(fromAndRest)}</span>`;
  }

  // No ":" and no "from" — return as-is (escaped)
  return escapeHtml(trimmed);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
