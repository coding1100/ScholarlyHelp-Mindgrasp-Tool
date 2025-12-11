"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface HomePageData {
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

const HomeDataContext = createContext<HomePageData | null>(null);

export function HomeDataProvider({ 
  children, 
  data 
}: { 
  children: ReactNode; 
  data: HomePageData | null;
}) {
  return (
    <HomeDataContext.Provider value={data}>
      {children}
    </HomeDataContext.Provider>
  );
}

export function useHomeData() {
  return useContext(HomeDataContext);
}

