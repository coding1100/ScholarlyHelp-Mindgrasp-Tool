"use client";

import { useState, useEffect } from "react";

export default function OnTimeDeliveryGuaranteeAdmin() {
  const [pageData, setPageData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      setPageLoading(true);
      try {
        const res = await fetch(`/api/admin/on-time-delivery-guarantee`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setPageData(data && Object.keys(data).length > 0 ? {
          ...data,
          pageType: data.id || data.pageType || 'on-time-delivery-guarantee'
        } : {
          id: 'on-time-delivery-guarantee',
          pageType: 'on-time-delivery-guarantee',
          status: 'published',
          meta: { title: '', description: '', canonicalUrl: '' },
          heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
          whyGuarantee: { mainHeading: '', description: '', heading2: '', details: [] },
          whyGuaranteeContent: { details: { title: '', description: '', list: [], text: '' } },
          HowGuaranteeWorks: { mainHeading: '', steps: [] },
          whyScholalrySlider: { mainHeading: '', description: '', ctaButton: { text: '' } },
          academicPartners: { mainHeading: '', description: '', defaultCard: [], ctaButton: { text: '' } },
          faq: []
        });
      } catch (error) {
        console.error('Error fetching page:', error);
        setPageData({
          id: 'on-time-delivery-guarantee',
          pageType: 'on-time-delivery-guarantee',
          status: 'published',
          meta: { title: '', description: '', canonicalUrl: '' },
          heroSection: { mainHeading: '', subHeading: '', description: '', btn1: '', btn2: '', btn1Url: '', btn2Url: '' },
          whyGuarantee: { mainHeading: '', description: '', heading2: '', details: [] },
          whyGuaranteeContent: { details: { title: '', description: '', list: [], text: '' } },
          HowGuaranteeWorks: { mainHeading: '', steps: [] },
          whyScholalrySlider: { mainHeading: '', description: '', ctaButton: { text: '' } },
          academicPartners: { mainHeading: '', description: '', defaultCard: [], ctaButton: { text: '' } },
          faq: []
        });
      } finally {
        setPageLoading(false);
      }
    };
    loadPage();
  }, []);

  const updatePageData = (path: string, value: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (path: string, item: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      if (!Array.isArray(current[keys[keys.length - 1]])) {
        current[keys[keys.length - 1]] = [];
      }
      current[keys[keys.length - 1]].push(item);
      return newData;
    });
  };

  const updateArrayItem = (path: string, index: number, field: string, value: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current[index][field] = value;
      return newData;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current.splice(index, 1);
      return newData;
    });
  };

  const handlePageSave = async () => {
    if (!pageData) return;
    setPageLoading(true);
    try {
      const response = await fetch('/api/admin/on-time-delivery-guarantee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Page saved successfully!');
      } else {
        alert(`Error: ${result.error || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert(`Error saving page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setPageLoading(false);
    }
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
              <input
                type="text"
                value={pageData.meta?.canonicalUrl || ''}
                onChange={(e) => updatePageData('meta.canonicalUrl', e.target.value)}
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

        {/* Why Guarantee Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Guarantee</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.whyGuarantee?.mainHeading || ''}
                onChange={(e) => updatePageData('whyGuarantee.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={pageData.whyGuarantee?.description || ''}
                onChange={(e) => updatePageData('whyGuarantee.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading 2</label>
              <input
                type="text"
                value={pageData.whyGuarantee?.heading2 || ''}
                onChange={(e) => updatePageData('whyGuarantee.heading2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Details (3 Image Section)</label>
              {(pageData.whyGuarantee?.details || []).map((detail: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Detail {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('whyGuarantee.details', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={detail.title || ''}
                        onChange={(e) => updateArrayItem('whyGuarantee.details', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={detail.description || ''}
                        onChange={(e) => updateArrayItem('whyGuarantee.details', index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('whyGuarantee.details', { title: '', description: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Detail
              </button>
            </div>
          </div>
        </div>

        {/* Why Guarantee Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Guarantee Content</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <textarea
                    rows={2}
                    value={pageData.whyGuaranteeContent?.details?.title || ''}
                    onChange={(e) => updatePageData('whyGuaranteeContent.details.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Use &lt;br/&gt; for line breaks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={pageData.whyGuaranteeContent?.details?.description || ''}
                    onChange={(e) => updatePageData('whyGuaranteeContent.details.description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">List (one per line)</label>
                  <textarea
                    rows={8}
                    value={(pageData.whyGuaranteeContent?.details?.list || []).join('\n')}
                    onChange={(e) => updatePageData('whyGuaranteeContent.details.list', e.target.value.split('\n').filter(Boolean))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Item 1&#10;Item 2&#10;Item 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <textarea
                    rows={3}
                    value={pageData.whyGuaranteeContent?.details?.text || ''}
                    onChange={(e) => updatePageData('whyGuaranteeContent.details.text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Guarantee Works */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How Guarantee Works</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.HowGuaranteeWorks?.mainHeading || ''}
                onChange={(e) => updatePageData('HowGuaranteeWorks.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Steps</label>
              {(pageData.HowGuaranteeWorks?.steps || []).map((step: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Step {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('HowGuaranteeWorks.steps', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={(e) => updateArrayItem('HowGuaranteeWorks.steps', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={step.description || ''}
                        onChange={(e) => updateArrayItem('HowGuaranteeWorks.steps', index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('HowGuaranteeWorks.steps', { title: '', description: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + Add Step
              </button>
            </div>
          </div>
        </div>

        {/* Why Scholarly Slider */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Scholarly Slider</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.whyScholalrySlider?.mainHeading || pageData.whyScholarlySlider?.mainHeading || ''}
                onChange={(e) => updatePageData('whyScholalrySlider.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={pageData.whyScholalrySlider?.description || pageData.whyScholarlySlider?.description || ''}
                onChange={(e) => updatePageData('whyScholalrySlider.description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={pageData.whyScholalrySlider?.ctaButton?.text || pageData.whyScholarlySlider?.ctaButton?.text || ''}
                onChange={(e) => updatePageData('whyScholalrySlider.ctaButton.text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Academic Partners */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Partners</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-4">Cards</label>
              {(pageData.academicPartners?.defaultCard || []).map((card: any, index: number) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Card {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('academicPartners.defaultCard', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">ID</label>
                      <input
                        type="number"
                        value={card.id || ''}
                        onChange={(e) => updateArrayItem('academicPartners.defaultCard', index, 'id', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title || ''}
                        onChange={(e) => updateArrayItem('academicPartners.defaultCard', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={card.description || ''}
                        onChange={(e) => updateArrayItem('academicPartners.defaultCard', index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('academicPartners.defaultCard', { id: 0, title: '', description: '' })}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 hidden"
              >
                + Add Card
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">FAQ Section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">FAQs</label>
            {(pageData.faq || []).map((faq: any, index: number) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">FAQ {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('faq', index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Question</label>
                    <input
                      type="text"
                      value={faq.question || ''}
                      onChange={(e) => updateArrayItem('faq', index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      value={faq.answer || ''}
                      onChange={(e) => updateArrayItem('faq', index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('faq', { id: (pageData.faq?.length || 0) + 1, question: '', answer: '' })}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              + Add FAQ
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pageLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {pageLoading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </form>
    );
  };

  if (pageLoading && !pageData) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit On-Time Delivery Guarantee Page</h1>
        <p className="mt-2 text-sm text-gray-600">Update the content for the On-Time Delivery Guarantee page</p>
      </div>
      {renderPageForm()}
    </div>
  );
}

