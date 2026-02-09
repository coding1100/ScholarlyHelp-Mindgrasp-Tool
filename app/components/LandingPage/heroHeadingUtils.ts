/**
 * Shared styling for hero main heading (used by server HeroHeading and client HeroLead).
 */
export function styleParentheticalText(text: string): string {
  let styledText = text.replace(
    /\(Guaranteed A or B\)/gi,
    '<span class="text-[#ff641a]">$&</span>'
  );
  styledText = styledText.replace(
    /with 100% Domestic Logins to protect your identity\./gi,
    '<span class="font-semibold">$&</span>'
  );
  return styledText;
}
