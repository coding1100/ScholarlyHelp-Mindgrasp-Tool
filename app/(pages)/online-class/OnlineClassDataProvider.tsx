"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface OnlineClassPageData {
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

const OnlineClassDataContext = createContext<OnlineClassPageData | null>(null);

export function OnlineClassDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: OnlineClassPageData | null;
}) {
  return (
    <OnlineClassDataContext.Provider value={data}>
      {children}
    </OnlineClassDataContext.Provider>
  );
}

export function useOnlineClassData() {
  return useContext(OnlineClassDataContext);
}

