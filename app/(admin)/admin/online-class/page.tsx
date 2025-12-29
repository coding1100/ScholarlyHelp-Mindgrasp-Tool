"use client";

import { useState, useEffect } from "react";
import { subjects } from "@/app/(pages)/online-class/subjectContent";

export default function OnlineClassAdmin() {
  const [availablePages, setAvailablePages] = useState<Array<{ id: string; slug?: string; title?: string }>>([]);
  const [selectedPage, setSelectedPage] = useState<string>('online_class_page');
  const [pageData, setPageData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);

  // Fetch all available pages
  useEffect(() => {
    const fetchAvailablePages = async () => {
      try {
        const res = await fetch('/api/admin/online-class?list=all');
        if (!res.ok) {
          console.error('Failed to fetch pages:', res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          console.error('API error:', data.error);
          throw new Error(data.error);
        }
        if (data.pages && Array.isArray(data.pages)) {
          // Use a Map to deduplicate by normalized ID
          const pagesMap = new Map<string, { id: string; slug: string; title: string }>();

          data.pages.forEach((page: any) => {
            let pageId = page.id || page.slug || '';
            let slug = page.slug || page.id || '';

            // Normalize "main" to "online_class_page"
            if (pageId === 'main') {
              pageId = 'online_class_page';
            }

            // Handle cases where pageId might have "online_classes_" (with 's') prefix
            if (pageId.startsWith('online_classes_')) {
              pageId = pageId.replace('online_classes_', 'online_class_');
            }

            // Normalize IDs: if it's a subject page without online_class_ prefix, add it
            if (pageId && pageId !== 'online_class_page' && !pageId.startsWith('online_class_')) {
              // If it's a subject slug like "english", make it "online_class_english"
              pageId = `online_class_${pageId}`;
            }

            // Extract slug from online_class_ prefixed IDs
            if (pageId.startsWith('online_class_') && pageId !== 'online_class_page') {
              slug = pageId.replace('online_class_', '');
            }

            // Format title - extract just the subject name
            let title = '';
            if (pageId === 'online_class_page') {
              title = 'Online Class';
            } else if (pageId.startsWith('online_class_')) {
              // Extract subject name by removing "online_class_" prefix
              let subjectName = pageId.replace('online_class_', '');
              // Capitalize first letter of each word
              subjectName = subjectName.replace(/-/g, ' ').split(' ').map((word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              title = `Online Class ${subjectName}`;
            } else {
              title = page.title || page.meta?.title || pageId.replace(/-/g, ' ');
            }

            // Only add if ID is valid and not already in map
            if (pageId && !pagesMap.has(pageId)) {
              pagesMap.set(pageId, {
                id: pageId,
                slug: slug,
                title: title
              });
            }
          });

          // Add any missing subjects from subjects
          subjects.forEach(subject => {
            const id = `online_class_${subject}`;
            if (!pagesMap.has(id)) {
              // Format title
              let subjectName = subject.replace(/-/g, ' ');
              subjectName = subjectName.split(' ').map((word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              const title = `Online Class ${subjectName}`;

              pagesMap.set(id, {
                id: id,
                slug: subject,
                title: title
              });
            }
          });

          // Convert map to array
          const pages = Array.from(pagesMap.values());

          // Ensure online_class_page is in the list
          const hasOnlineClassPage = pages.some((p: any) => p.id === 'online_class_page');
          if (!hasOnlineClassPage) {
            pages.unshift({ id: 'online_class_page', slug: 'online_class_page', title: 'Online Class' });
          }

          // Sort: online_class_page first, then alphabetically
          pages.sort((a: any, b: any) => {
            if (a.id === 'online_class_page') return -1;
            if (b.id === 'online_class_page') return 1;
            return a.title.localeCompare(b.title);
          });

          setAvailablePages(pages);
        } else {
          // Default pages if none found
          setAvailablePages([
            { id: 'online_class_page', slug: 'online_class_page', title: 'Online Class' },
            { id: 'online_class_english', slug: 'english', title: 'Online Class English' },
            { id: 'online_class_math', slug: 'math', title: 'Online Class Math' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching available pages:', error);
        alert(`Error loading pages: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your DATABASE_URL environment variable in Vercel.`);
        // Default pages on error
        setAvailablePages([
          { id: 'online_class_page', slug: 'online_class_page', title: 'Online Class' },
          { id: 'online_class_english', slug: 'english', title: 'Online Class English' },
          { id: 'online_class_math', slug: 'math', title: 'Online Class Math' }
        ]);
      }
    };
    fetchAvailablePages();
  }, []);

  // Auto-select online_class_page when pages are loaded
  useEffect(() => {
    if (availablePages.length > 0 && selectedPage === 'online_class_page' && !pageData && !pageLoading) {
      const loadOnlineClassPage = async () => {
        setPageLoading(true);
        try {
          // For main page, fetch without slug to trigger main page query logic
          const res = await fetch(`/api/admin/online-class`);
          if (!res.ok) {
            console.error('Failed to fetch online-class page:', res.status, res.statusText);
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          if (data.error) {
            console.error('API error:', data.error);
            throw new Error(data.error);
          }

          setPageData(data && Object.keys(data).length > 0 ? {
            ...data,
            pageType: data.id || data.pageType || 'online_class_page'
          } : {
            id: 'online_class_page',
            pageType: 'online_class_page',
            meta: { title: '', description: '' },
            heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
            whySlider: {
              mainHeading: 'Why choose Scholarly',
              description: 'Scholarly Help offers plenty of services through skilled online class helpers and various subject experts.',
              ctaButton: { text: 'Take my online class' }
            },
            cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
            description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
            guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
            processSection: {
              mainHeading: 'State-of-the-Art Process We Follow',
              description: "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way.",
              steps: [
                { stepNumber: 1, title: 'Place Your<br/>Order', description: 'Use our online form, WhatsApp, Live chat, or email to submit order' },
                { stepNumber: 2, title: 'Confirm<br/>Payment', description: 'Secure your order with an advance payment to initiate the process.' },
                { stepNumber: 3, title: 'Expert Work<br/>in Progress', description: 'Our skilled tutors start working on your order promptly.' },
                { stepNumber: 4, title: 'Get Your<br/>Solution', description: 'Receive your completed work on time, ready for submission.' }
              ]
            },
            success: { mainHeading: '', description: '', ctaButton: { text: '' } },
            academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
            subjects: { mainHeading: '', description: '', ctaText: '', subjectsContent: [] },
            getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
            faq: { mainHeading: '', faqs: [] }
          });
        } catch (error) {
          console.error('Error fetching online-class page:', error);
          setPageData({
            id: 'online_class_page',
            pageType: 'online_class_page',
            meta: { title: '', description: '' },
            heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
            whySlider: {
              mainHeading: 'Why choose Scholarly',
              description: 'Scholarly Help offers plenty of services through skilled online class helpers and various subject experts.',
              ctaButton: { text: 'Take my online class' }
            },
            cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
            description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
            guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
            processSection: {
              mainHeading: 'State-of-the-Art Process We Follow',
              description: "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way.",
              steps: [
                { stepNumber: 1, title: 'Place Your<br/>Order', description: 'Use our online form, WhatsApp, Live chat, or email to submit order' },
                { stepNumber: 2, title: 'Confirm<br/>Payment', description: 'Secure your order with an advance payment to initiate the process.' },
                { stepNumber: 3, title: 'Expert Work<br/>in Progress', description: 'Our skilled tutors start working on your order promptly.' },
                { stepNumber: 4, title: 'Get Your<br/>Solution', description: 'Receive your completed work on time, ready for submission.' }
              ]
            },
            success: { mainHeading: '', description: '', ctaButton: { text: '' } },
            academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
            subjects: { mainHeading: '', description: '', ctaText: '', subjectsContent: [] },
            getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
            faq: { mainHeading: '', faqs: [] }
          });
        } finally {
          setPageLoading(false);
        }
      };
      loadOnlineClassPage();
    }
  }, [availablePages]);

  // Fetch page data when page is selected
  const handlePageChange = async (pageId: string) => {
    setSelectedPage(pageId);
    if (pageId) {
      setPageLoading(true);
      try {
        // Find the page in availablePages for slug extraction
        const page = availablePages.find(p => p.id === pageId);

        // For main page, fetch without slug to trigger main page query logic
        let apiUrl = '';
        if (pageId === 'online_class_page') {
          apiUrl = '/api/admin/online-class';
        } else {
          // Use the pageId directly as slug for API call (handles both online_class_english and english formats)
          const slug = pageId.startsWith('online_class_') ? pageId : (page?.slug || pageId);
          apiUrl = `/api/admin/online-class?slug=${slug}`;
        }
        const res = await fetch(apiUrl);
        if (!res.ok) {
          console.error('Failed to fetch page:', res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.error) {
          console.error('API error:', data.error);
          throw new Error(data.error);
        }

        if (pageId === 'online_class_page') {
          // online-class page structure
          setPageData(data && Object.keys(data).length > 0 ? {
            ...data,
            pageType: data.id || data.pageType || 'online_class_page'
          } : {
            id: 'online_class_page',
            pageType: 'online_class_page',
            meta: { title: '', description: '' },
            heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
            whySlider: {
              mainHeading: 'Why choose Scholarly',
              description: 'Scholarly Help offers plenty of services through skilled online class helpers and various subject experts.',
              ctaButton: { text: 'Take my online class' }
            },
            cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
            description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
            guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
            processSection: {
              mainHeading: 'State-of-the-Art Process We Follow',
              description: "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way.",
              steps: [
                { stepNumber: 1, title: 'Place Your<br/>Order', description: 'Use our online form, WhatsApp, Live chat, or email to submit order' },
                { stepNumber: 2, title: 'Confirm<br/>Payment', description: 'Secure your order with an advance payment to initiate the process.' },
                { stepNumber: 3, title: 'Expert Work<br/>in Progress', description: 'Our skilled tutors start working on your order promptly.' },
                { stepNumber: 4, title: 'Get Your<br/>Solution', description: 'Receive your completed work on time, ready for submission.' }
              ]
            },
            success: { mainHeading: '', description: '', ctaButton: { text: '' } },
            academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
            subjects: { mainHeading: '', description: '', ctaText: '', subjectsContent: [] },
            getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
            faq: { mainHeading: '', faqs: [] }
          });
        } else {
          // Subject page structure (same as online_class_english)
          // Extract slug from pageId (online_class_english -> english)
          const extractedSlug = pageId.startsWith('online_class_')
            ? pageId.replace('online_class_', '')
            : (page?.slug || pageId);

          setPageData(data && Object.keys(data).length > 0 ? {
            ...data,
            slug: data.slug || extractedSlug,
            id: data.id || pageId,
            pageType: data.id || pageId
          } : {
            id: pageId,
            slug: extractedSlug,
            pageType: pageId,
            meta: { title: '', description: '' },
            heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
            whySlider: {
              mainHeading: 'Why choose Scholarly',
              description: 'Scholarly Help offers plenty of services through skilled online class helpers and various subject experts.',
              ctaButton: { text: 'Take my online class' }
            },
            cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
            description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
            guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
            processSection: {
              mainHeading: 'State-of-the-Art Process We Follow',
              description: "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way.",
              steps: [
                { stepNumber: 1, title: 'Place Your<br/>Order', description: 'Use our online form, WhatsApp, Live chat, or email to submit order' },
                { stepNumber: 2, title: 'Confirm<br/>Payment', description: 'Secure your order with an advance payment to initiate the process.' },
                { stepNumber: 3, title: 'Expert Work<br/>in Progress', description: 'Our skilled tutors start working on your order promptly.' },
                { stepNumber: 4, title: 'Get Your<br/>Solution', description: 'Receive your completed work on time, ready for submission.' }
              ]
            },
            success: { mainHeading: '', description: '', ctaButton: { text: '' } },
            academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
            subjects: { mainHeading: '', description: '', ctaText: '', subjectsContent: [] },
            getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
            faq: { mainHeading: '', faqs: [] }
          });
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        if (pageId === 'online_class_page') {
          setPageData({
            id: 'online_class_page',
            pageType: 'online_class_page',
            meta: { title: '', description: '' },
            heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
            whySlider: {
              mainHeading: 'Why choose Scholarly',
              description: 'Scholarly Help offers plenty of services through skilled online class helpers and various subject experts.',
              ctaButton: { text: 'Take my online class' }
            },
            cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
            description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
            guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
            processSection: {
              mainHeading: 'State-of-the-Art Process We Follow',
              description: "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way.",
              steps: [
                { stepNumber: 1, title: 'Place Your<br/>Order', description: 'Use our online form, WhatsApp, Live chat, or email to submit order' },
                { stepNumber: 2, title: 'Confirm<br/>Payment', description: 'Secure your order with an advance payment to initiate the process.' },
                { stepNumber: 3, title: 'Expert Work<br/>in Progress', description: 'Our skilled tutors start working on your order promptly.' },
                { stepNumber: 4, title: 'Get Your<br/>Solution', description: 'Receive your completed work on time, ready for submission.' }
              ]
            },
            success: { mainHeading: '', description: '', ctaButton: { text: '' } },
            academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
            subjects: { mainHeading: '', description: '', ctaText: '', subjectsContent: [] },
            getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
            faq: { mainHeading: '', faqs: [] }
          });
        } else {
          // Extract slug from pageId (online_class_english -> english)
          const extractedSlug = pageId.startsWith('online_class_')
            ? pageId.replace('online_class_', '')
            : (availablePages.find(p => p.id === pageId)?.slug || pageId);
          setPageData({
            id: pageId,
            slug: extractedSlug,
            pageType: pageId,
            meta: { title: '', description: '' },
            heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
            whySlider: {
              mainHeading: 'Why choose Scholarly',
              description: 'Scholarly Help offers plenty of services through skilled online class helpers and various subject experts.',
              ctaButton: { text: 'Take my online class' }
            },
            cardCarousel: { mainHeading: '', description: '', ctaButton: { text: '' } },
            description: { mainHeading: '', description: '', services: [], badges: [], ctaButton: { text: '' } },
            guaranteedBlock: { mainHeading: '', description: '', ctaButton: { text: '' } },
            processSection: {
              mainHeading: 'State-of-the-Art Process We Follow',
              description: "Beyond the subjects listed below, we excel at handling diverse topics effectively. Our expertise knows no bounds, ensuring we're ready for any challenge that comes our way.",
              steps: [
                { stepNumber: 1, title: 'Place Your<br/>Order', description: 'Use our online form, WhatsApp, Live chat, or email to submit order' },
                { stepNumber: 2, title: 'Confirm<br/>Payment', description: 'Secure your order with an advance payment to initiate the process.' },
                { stepNumber: 3, title: 'Expert Work<br/>in Progress', description: 'Our skilled tutors start working on your order promptly.' },
                { stepNumber: 4, title: 'Get Your<br/>Solution', description: 'Receive your completed work on time, ready for submission.' }
              ]
            },
            success: { mainHeading: '', description: '', ctaButton: { text: '' } },
            academicPartners: { mainHeading: '', description: '', cards: [], ctaButton: { text: '' } },
            subjects: { mainHeading: '', description: '', ctaText: '', subjectsContent: [] },
            getQuote: { mainHeading: '', description: '', ctaButton: { text: '' } },
            faq: { mainHeading: '', faqs: [] }
          });
        }
      } finally {
        setPageLoading(false);
      }
    } else {
      setPageData(null);
    }
  };

  const handlePageSave = async () => {
    if (!pageData) return;
    setPageLoading(true);
    try {
      const response = await fetch('/api/admin/online-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Page saved successfully!');
        // Refresh available pages list
        const res = await fetch('/api/admin/online-class?list=all');
        const data = await res.json();
        if (data.pages && Array.isArray(data.pages)) {
          // Use a Map to deduplicate by normalized ID
          const pagesMap = new Map<string, { id: string; slug: string; title: string }>();

          data.pages.forEach((page: any) => {
            let pageId = page.id || page.slug || '';
            let slug = page.slug || page.id || '';

            // Normalize "main" to "online_class_page"
            if (pageId === 'main') {
              pageId = 'online_class_page';
            }

            // Handle cases where pageId might have "online_classes_" (with 's') prefix
            if (pageId.startsWith('online_classes_')) {
              pageId = pageId.replace('online_classes_', 'online_class_');
            }

            // Normalize IDs: if it's a subject page without online_class_ prefix, add it
            if (pageId && pageId !== 'online_class_page' && !pageId.startsWith('online_class_')) {
              pageId = `online_class_${pageId}`;
            }

            // Extract slug from online_class_ prefixed IDs
            if (pageId.startsWith('online_class_') && pageId !== 'online_class_page') {
              slug = pageId.replace('online_class_', '');
            }

            // Format title - extract just the subject name
            let title = '';
            if (pageId === 'online_class_page') {
              title = 'Online Class';
            } else if (pageId.startsWith('online_class_')) {
              // Extract subject name by removing "online_class_" prefix
              let subjectName = pageId.replace('online_class_', '');
              // Capitalize first letter of each word
              subjectName = subjectName.replace(/-/g, ' ').split(' ').map((word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              title = `Online Class ${subjectName}`;
            } else {
              title = page.title || page.meta?.title || pageId.replace(/-/g, ' ');
            }

            // Only add if ID is valid and not already in map
            if (pageId && !pagesMap.has(pageId)) {
              pagesMap.set(pageId, {
                id: pageId,
                slug: slug,
                title: title
              });
            }
          });

          // Convert map to array
          const pages = Array.from(pagesMap.values());

          const hasOnlineClassPage = pages.some((p: any) => p.id === 'online_class_page');
          if (!hasOnlineClassPage) {
            pages.unshift({ id: 'online_class_page', slug: 'online_class_page', title: 'Online Class' });
          }

          // Sort: online_class_page first, then alphabetically
          pages.sort((a: any, b: any) => {
            if (a.id === 'online_class_page') return -1;
            if (b.id === 'online_class_page') return 1;
            return a.title.localeCompare(b.title);
          });

          setAvailablePages(pages);
        }
      } else {
        alert('Error saving page');
      }
    } catch (error) {
      alert('Error saving page');
    } finally {
      setPageLoading(false);
    }
  };

  const handlePageDelete = async () => {
    if (!pageData?.id || pageData.id === 'online_class_page') {
      alert('Cannot delete the main online-class page');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${pageData.id}"? This action cannot be undone.`)) {
      return;
    }

    setPageLoading(true);
    try {
      const page = availablePages.find(p => p.id === pageData.id);
      const slug = page?.slug || pageData.slug || pageData.id;
      const response = await fetch(`/api/admin/online-class?slug=${slug}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        alert('Page deleted successfully!');
        setSelectedPage('');
        setPageData(null);
        // Refresh available pages list
        const res = await fetch('/api/admin/online-class?list=all');
        const data = await res.json();
        if (data.pages && Array.isArray(data.pages)) {
          // Use a Map to deduplicate by normalized ID
          const pagesMap = new Map<string, { id: string; slug: string; title: string }>();

          data.pages.forEach((page: any) => {
            let pageId = page.id || page.slug || '';
            let slug = page.slug || page.id || '';

            // Normalize "main" to "online_class_page"
            if (pageId === 'main') {
              pageId = 'online_class_page';
            }

            // Handle cases where pageId might have "online_classes_" (with 's') prefix
            if (pageId.startsWith('online_classes_')) {
              pageId = pageId.replace('online_classes_', 'online_class_');
            }

            // Normalize IDs: if it's a subject page without online_class_ prefix, add it
            if (pageId && pageId !== 'online_class_page' && !pageId.startsWith('online_class_')) {
              pageId = `online_class_${pageId}`;
            }

            // Extract slug from online_class_ prefixed IDs
            if (pageId.startsWith('online_class_') && pageId !== 'online_class_page') {
              slug = pageId.replace('online_class_', '');
            }

            // Format title - extract just the subject name
            let title = '';
            if (pageId === 'online_class_page') {
              title = 'Online Class';
            } else if (pageId.startsWith('online_class_')) {
              // Extract subject name by removing "online_class_" prefix
              let subjectName = pageId.replace('online_class_', '');
              // Capitalize first letter of each word
              subjectName = subjectName.replace(/-/g, ' ').split(' ').map((word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ');
              title = `Online Class ${subjectName}`;
            } else {
              title = page.title || page.meta?.title || pageId.replace(/-/g, ' ');
            }

            // Only add if ID is valid and not already in map
            if (pageId && !pagesMap.has(pageId)) {
              pagesMap.set(pageId, {
                id: pageId,
                slug: slug,
                title: title
              });
            }
          });

          // Convert map to array
          const pages = Array.from(pagesMap.values());

          const hasOnlineClassPage = pages.some((p: any) => p.id === 'online_class_page');
          if (!hasOnlineClassPage) {
            pages.unshift({ id: 'online_class_page', slug: 'online_class_page', title: 'Online Class' });
          }

          // Sort: online_class_page first, then alphabetically
          pages.sort((a: any, b: any) => {
            if (a.id === 'online_class_page') return -1;
            if (b.id === 'online_class_page') return 1;
            return a.title.localeCompare(b.title);
          });

          setAvailablePages(pages);
        }
      } else {
        alert('Error deleting page');
      }
    } catch (error) {
      alert('Error deleting page');
    } finally {
      setPageLoading(false);
    }
  };

  const updatePageData = (path: string, value: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone to avoid reference issues
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateArrayItem = (path: string, index: number, field: string, value: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) current[keys[i]] = [];
        current = current[keys[i]];
      }
      if (!current[index]) current[index] = {};
      current[index][field] = value;
      return newData;
    });
  };

  const addArrayItem = (path: string, defaultItem: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone to avoid reference issues
      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) current[keys[i]] = [];
        current = current[keys[i]];
      }
      current.push(defaultItem);
      return newData;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current.splice(index, 1);
      return newData;
    });
  };

  const renderPageForm = () => {
    if (!pageData) return null;

    return (
      <form onSubmit={(e) => { e.preventDefault(); handlePageSave(); }} className="space-y-8">
        {/* Meta Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO & Meta</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={pageData.meta?.title || ''}
                onChange={(e) => updatePageData('meta.title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={3}
                value={pageData.meta?.description || ''}
                onChange={(e) => updatePageData('meta.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hero Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <textarea
                rows={3}
                value={pageData.heroSection?.mainHeading || ''}
                onChange={(e) => updatePageData('heroSection.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Use &lt;br/&gt; for line breaks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
              <input
                type="text"
                value={pageData.heroSection?.subHeading || ''}
                onChange={(e) => updatePageData('heroSection.subHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={pageData.heroSection?.description || ''}
                onChange={(e) => updatePageData('heroSection.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button 1 Text</label>
                <input
                  type="text"
                  value={pageData.heroSection?.btn1 || ''}
                  onChange={(e) => updatePageData('heroSection.btn1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Default: Take My Full Class"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button 2 Text</label>
                <input
                  type="text"
                  value={pageData.heroSection?.btn2 || ''}
                  onChange={(e) => updatePageData('heroSection.btn2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Default: Pass My Exam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button 1 URL</label>
                <input
                  type="text"
                  value={pageData.heroSection?.btn1Url || ''}
                  onChange={(e) => updatePageData('heroSection.btn1Url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., /contact-us or https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button 2 URL</label>
                <input
                  type="text"
                  value={pageData.heroSection?.btn2Url || ''}
                  onChange={(e) => updatePageData('heroSection.btn2Url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., /contact-us or https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Slider Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Slider Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.whySlider?.mainHeading || ''}
                onChange={(e) => updatePageData('whySlider.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.whySlider?.description || ''}
                onChange={(e) => updatePageData('whySlider.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.whySlider?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('whySlider.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Card Carousel Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Carousel Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.cardCarousel?.mainHeading || ''}
                onChange={(e) => updatePageData('cardCarousel.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.cardCarousel?.description || ''}
                onChange={(e) => updatePageData('cardCarousel.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.cardCarousel?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('cardCarousel.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Description Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.description?.mainHeading || ''}
                onChange={(e) => updatePageData('description.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={pageData.description?.description || ''}
                onChange={(e) => updatePageData('description.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Use &lt;br/&gt; for line breaks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.description?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('description.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badges (comma-separated)</label>
              <input
                type="text"
                value={(pageData.description?.badges || []).join(', ')}
                onChange={(e) => updatePageData('description.badges', e.target.value.split(',').map((b: string) => b.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Online Class Help, online-class Help, Online online-class Help"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Services</label>
              {(pageData.description?.services || []).map((service: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Service {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('description.services', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={service.title || ''}
                      onChange={(e) => updateArrayItem('description.services', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Service Title"
                    />
                    <textarea
                      rows={2}
                      value={service.description || ''}
                      onChange={(e) => updateArrayItem('description.services', index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Service Description"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('description.services', { title: '', description: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Service
              </button>
            </div>
          </div>
        </div>

        {/* Guaranteed Block Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Guaranteed Block Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.guaranteedBlock?.mainHeading || ''}
                onChange={(e) => updatePageData('guaranteedBlock.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.guaranteedBlock?.description || ''}
                onChange={(e) => updatePageData('guaranteedBlock.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.guaranteedBlock?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('guaranteedBlock.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Process Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.processSection?.mainHeading || ''}
                onChange={(e) => updatePageData('processSection.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.processSection?.description || ''}
                onChange={(e) => updatePageData('processSection.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Process Steps</label>
              {(pageData.processSection?.steps || []).map((step: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Step {step.stepNumber || index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('processSection.steps', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="number"
                      value={step.stepNumber || index + 1}
                      onChange={(e) => updateArrayItem('processSection.steps', index, 'stepNumber', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Step Number"
                    />
                    <textarea
                      rows={2}
                      value={step.title || ''}
                      onChange={(e) => updateArrayItem('processSection.steps', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Step Title (use &lt;br/&gt; for line breaks)"
                    />
                    <textarea
                      rows={2}
                      value={step.description || ''}
                      onChange={(e) => updateArrayItem('processSection.steps', index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Step Description"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('processSection.steps', { stepNumber: (pageData.processSection?.steps?.length || 0) + 1, title: '', description: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Step
              </button>
            </div>
          </div>
        </div>

        {/* Success Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Success Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.success?.mainHeading || ''}
                onChange={(e) => updatePageData('success.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.success?.description || ''}
                onChange={(e) => updatePageData('success.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.success?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('success.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Success Slides</label>
              {(pageData.success?.slides || []).map((slide: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Slide {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('success.slides', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={slide.image || ''}
                      onChange={(e) => updateArrayItem('success.slides', index, 'image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Image Path (e.g., /images/proof-1.webp)"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('success.slides', { id: Date.now(), image: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Slide
              </button>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects & Majors We Cover Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.subjects?.mainHeading || ''}
                onChange={(e) => updatePageData('subjects.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.subjects?.description || ''}
                onChange={(e) => updatePageData('subjects.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.subjects?.ctaText || ''}
                onChange={(e) => updatePageData('subjects.ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Default: Take my online class"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Subject Cards</label>
              {(pageData.subjects?.subjectsContent || []).map((subject: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Subject {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('subjects.subjectsContent', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={subject.title || ''}
                        onChange={(e) => updateArrayItem('subjects.subjectsContent', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="e.g., English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">URL (relative path)</label>
                      <input
                        type="text"
                        value={subject.url || ''}
                        onChange={(e) => updateArrayItem('subjects.subjectsContent', index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="e.g., /english"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Icon Path</label>
                      <input
                        type="text"
                        value={subject.icon || ''}
                        onChange={(e) => updateArrayItem('subjects.subjectsContent', index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="e.g., /assets/Icon/english.png"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* <button
                type="button"
                onClick={() => addArrayItem('subjects.subjectsContent', { title: '', icon: '', url: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Subject Card
              </button> */}
            </div>
          </div>
        </div>

        {/* Academic Partners Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Partners Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.academicPartners?.mainHeading || ''}
                onChange={(e) => updatePageData('academicPartners.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.academicPartners?.description || ''}
                onChange={(e) => updatePageData('academicPartners.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.academicPartners?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('academicPartners.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Partner Cards</label>
              {(pageData.academicPartners?.cards || []).map((card: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Card {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('academicPartners.cards', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => updateArrayItem('academicPartners.cards', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Card Title"
                    />
                    <textarea
                      rows={2}
                      value={card.description || ''}
                      onChange={(e) => updateArrayItem('academicPartners.cards', index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Card Description"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('academicPartners.cards', { id: Date.now(), title: '', description: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Card
              </button>
            </div>
          </div>
        </div>

        {/* Get Quote Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Get Quote Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.getQuote?.mainHeading || ''}
                onChange={(e) => updatePageData('getQuote.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.getQuote?.description || ''}
                onChange={(e) => updatePageData('getQuote.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.getQuote?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('getQuote.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">FAQ Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.faq?.mainHeading || ''}
                onChange={(e) => updatePageData('faq.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">FAQ Items</label>
              {(pageData.faq?.faqs || []).map((faq: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">FAQ {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('faq.faqs', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={faq.question || ''}
                      onChange={(e) => updateArrayItem('faq.faqs', index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Question"
                    />
                    <textarea
                      rows={3}
                      value={faq.answer || ''}
                      onChange={(e) => updateArrayItem('faq.faqs', index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      placeholder="Answer"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('faq.faqs', { id: Date.now(), question: '', answer: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          {selectedPage && selectedPage !== 'online_class_page' && (
            <button
              type="button"
              onClick={handlePageDelete}
              disabled={pageLoading}
              className="inline-flex items-center px-6 py-3 border border-red-300 text-base font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={pageLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pageLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Online Class Content</h1>
        <p className="mt-2 text-sm text-gray-600">Select a page to edit its content</p>
      </div>

      {/* Page Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
        <select
          value={selectedPage}
          onChange={(e) => handlePageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a page...</option>
          {availablePages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title || page.id}
            </option>
          ))}
        </select>
      </div>

      {pageLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!pageLoading && selectedPage && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Editing:</strong> {availablePages.find(p => p.id === selectedPage)?.title || selectedPage}
          </p>
        </div>
      )}

      {pageData && !pageLoading && renderPageForm()}
    </div>
  );
}


