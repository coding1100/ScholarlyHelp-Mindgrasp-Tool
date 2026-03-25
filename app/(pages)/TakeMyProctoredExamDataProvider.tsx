"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface TakeMyProctoredExamPageData {
  heroSection?: any;
  ratings?: any;
  whySlider?: any;
  cardCarousel?: any;
  description?: any;
  guaranteedBlock?: any;
  customerReviews?: any;
  processSection?: any;
  success?: any;
  subjects?: any;
  academicPartners?: any;
  getQuote?: any;
  faq?: any;
  meta?: any;
}

const TakeMyProctoredExamDataContext =
  createContext<TakeMyProctoredExamPageData | null>(null);

export function TakeMyProctoredExamDataProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: TakeMyProctoredExamPageData | null;
}) {
  return (
    <TakeMyProctoredExamDataContext.Provider value={data}>
      {children}
    </TakeMyProctoredExamDataContext.Provider>
  );
}

export function useTakeMyProctoredExamData() {
  return useContext(TakeMyProctoredExamDataContext);
}

