"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface ExamPageData {
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

const ExamDataContext = createContext<ExamPageData | null>(null);

export function ExamDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: ExamPageData | null;
}) {
  return (
    <ExamDataContext.Provider value={data}>
      {children}
    </ExamDataContext.Provider>
  );
}

export function useExamData() {
  return useContext(ExamDataContext);
}

