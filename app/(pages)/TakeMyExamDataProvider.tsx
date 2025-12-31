"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface TakeMyExamPageData {
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

const TakeMyExamDataContext = createContext<TakeMyExamPageData | null>(null);

export function TakeMyExamDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: TakeMyExamPageData | null;
}) {
  return (
    <TakeMyExamDataContext.Provider value={data}>
      {children}
    </TakeMyExamDataContext.Provider>
  );
}

export function useTakeMyExamData() {
  return useContext(TakeMyExamDataContext);
}

