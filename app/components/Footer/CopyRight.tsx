"use client";

import { FC, useState, useEffect } from "react";

interface CopyRightProps {}

// Hardcode current year to prevent hydration mismatch
// Update this value at the start of each new year
const CURRENT_YEAR = 2026;

const CopyRight: FC<CopyRightProps> = ({}) => {
  // Use state to ensure consistent server/client rendering
  const [year, setYear] = useState(CURRENT_YEAR);

  useEffect(() => {
    // Update to actual year on client if different (edge case: year boundary)
    const actualYear = new Date().getFullYear();
    if (actualYear !== CURRENT_YEAR) {
      setYear(actualYear);
    }
  }, []);

  return (
    <div className="bg-primary-500 py-6">
      <div className="container mx-auto px-10 text-white text-center text-sm flex flex-col gap-3">
        <p>
          Copyrights © {year} All Rights Reserved by
          Scholarly Help
        </p>
        <p>Website owned and operated by Eliya Enterprises.</p>
      </div>
    </div>
  );
};

export default CopyRight;
