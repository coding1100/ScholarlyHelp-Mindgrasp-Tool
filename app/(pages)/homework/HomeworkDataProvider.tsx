"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface HomeworkPageData {
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

const HomeworkDataContext = createContext<HomeworkPageData | null>(null);

export function HomeworkDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: HomeworkPageData | null;
}) {
  return (
    <HomeworkDataContext.Provider value={data}>
      {children}
    </HomeworkDataContext.Provider>
  );
}

export function useHomeworkData() {
  return useContext(HomeworkDataContext);
}

