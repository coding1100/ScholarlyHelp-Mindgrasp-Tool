import React from "react";
import { styleParentheticalText } from "./heroHeadingUtils";

/**
 * Server-only hero heading so the LCP text is in the initial HTML (no client render delay).
 */
export default function HeroHeading({ mainHeading }: { mainHeading: string }) {
  if (!mainHeading) {
    return (
      <h1 className="font-semibold text-[30px] md:text-[48px] leading-[1.1] text-black">
        Stop Sacrificing
        <br />
        Your Time, We&apos;ll
        <br />
        Handle Your
        <br />
        Classes
      </h1>
    );
  }
  const styled = styleParentheticalText(mainHeading);
  return (
    <h1 className="font-semibold text-[30px] md:text-[48px] leading-[1.1] text-black">
      <span dangerouslySetInnerHTML={{ __html: styled }} />
    </h1>
  );
}
