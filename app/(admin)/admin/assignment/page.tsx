"use client";

import { useState, useEffect } from "react";

export default function AssignmentAdmin() {
  const [assignmentSubjects, setAssignmentSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [pageData, setPageData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const res = await fetch('/api/admin/assignment');
        const data = await res.json();
        if (data.subjects?.subjectsContent) {
          const subjects = data.subjects.subjectsContent
            .map((item: any) => item.url?.split('/').pop())
            .filter((slug: string) => slug);
          setAssignmentSubjects(subjects);
        }
      } catch (error) {
        console.error('Error fetching assignment data:', error);
      }
    };
    fetchAssignmentData();
  }, []);

  const handleSubjectChange = async (subject: string) => {
    setSelectedSubject(subject);
    if (subject) {
      setPageLoading(true);
      try {
        const res = await fetch(`/api/admin/assignment?slug=${subject}`);
        const page = await res.json();
        setPageData(page || {
          slug: subject,
          title: '',
          btnText: '',
          heroContent: { mainHeading: '', description: '' },
          academic: { mainheading: '', mainDescription: '', academicContent: [] },
          whyScholarly: { mainHeading: '', mainDescription: '', whyScholarlyContent: [] },
          subjects: { mainHeading: '', subjectsContent: [] },
          meta_title: '',
          meta_description: '',
          status: 'published'
        });
      } catch (error) {
        console.error('Error fetching page:', error);
        setPageData({
          slug: subject,
          title: '',
          btnText: '',
          heroContent: { mainHeading: '', description: '' },
          academic: { mainheading: '', mainDescription: '', academicContent: [] },
          whyScholarly: { mainHeading: '', mainDescription: '', whyScholarlyContent: [] },
          subjects: { mainHeading: '', subjectsContent: [] },
          meta_title: '',
          meta_description: '',
          status: 'published'
        });
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
      await fetch('/api/admin/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      alert('Page saved successfully!');
    } catch (error) {
      alert('Error saving page');
    } finally {
      setPageLoading(false);
    }
  };

  const updatePageData = (path: string, value: any) => {
    const keys = path.split('.');
    setPageData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Assignment Sub-Categories</h1>
        <p className="mt-2 text-sm text-gray-600">Select a subject to edit its content</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a subject...</option>
          {assignmentSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject.charAt(0).toUpperCase() + subject.slice(1).replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {pageLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {pageData && !pageLoading && (
        <form onSubmit={(e) => { e.preventDefault(); handlePageSave(); }} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hero Section</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={pageData.btnText || ''}
                  onChange={(e) => updatePageData('btnText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Get Assignment Help"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                <input
                  type="text"
                  value={pageData.heroContent?.mainHeading || ''}
                  onChange={(e) => updatePageData('heroContent.mainHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter main heading"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={pageData.heroContent?.description || ''}
                  onChange={(e) => updatePageData('heroContent.description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter hero description"
                />
              </div>
            </div>
          </div>

          {/* Academic Content */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                <input
                  type="text"
                  value={pageData.academic?.mainheading || ''}
                  onChange={(e) => updatePageData('academic.mainheading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
                <textarea
                  rows={3}
                  value={pageData.academic?.mainDescription || ''}
                  onChange={(e) => updatePageData('academic.mainDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Why Scholarly */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Scholarly Section</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                <input
                  type="text"
                  value={pageData.whyScholarly?.mainHeading || ''}
                  onChange={(e) => updatePageData('whyScholarly.mainHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
                <textarea
                  rows={3}
                  value={pageData.whyScholarly?.mainDescription || ''}
                  onChange={(e) => updatePageData('whyScholarly.mainDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.subjects?.mainHeading || ''}
                onChange={(e) => updatePageData('subjects.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Meta and Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO & Settings</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={pageData.meta_title || ''}
                  onChange={(e) => updatePageData('meta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  rows={3}
                  value={pageData.meta_description || ''}
                  onChange={(e) => updatePageData('meta_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={pageData.status || 'published'}
                  onChange={(e) => updatePageData('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
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
      )}
    </div>
  );
}