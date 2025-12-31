"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface TakeMyClassPageData {
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

const TakeMyClassDataContext = createContext<TakeMyClassPageData | null>(null);

export function TakeMyClassDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: TakeMyClassPageData | null;
}) {
  return (
    <TakeMyClassDataContext.Provider value={data}>
      {children}
    </TakeMyClassDataContext.Provider>
  );
}

export function useTakeMyClassData() {
  return useContext(TakeMyClassDataContext);
}

