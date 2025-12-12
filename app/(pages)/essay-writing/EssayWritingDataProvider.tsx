"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface EssayWritingPageData {
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

const EssayWritingDataContext = createContext<EssayWritingPageData | null>(null);

export function EssayWritingDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: EssayWritingPageData | null;
}) {
  return (
    <EssayWritingDataContext.Provider value={data}>
      {children}
    </EssayWritingDataContext.Provider>
  );
}

export function useEssayWritingData() {
  return useContext(EssayWritingDataContext);
}

