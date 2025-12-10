"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface AssignmentPageData {
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

const AssignmentDataContext = createContext<AssignmentPageData | null>(null);

export function AssignmentDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: AssignmentPageData | null;
}) {
  return (
    <AssignmentDataContext.Provider value={data}>
      {children}
    </AssignmentDataContext.Provider>
  );
}

export function useAssignmentData() {
  return useContext(AssignmentDataContext);
}

