"use client";

import { useState, useEffect } from "react";

type TabType = 'main' | 'subjects';

export default function AssignmentAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [assignmentSubjects, setAssignmentSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [mainPageData, setMainPageData] = useState<any>(null);
  const [subjectPageData, setSubjectPageData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);

  // Fetch main page data and subjects list
  useEffect(() => {
    const fetchMainPageData = async () => {
      try {
        const res = await fetch('/api/admin/assignment');
        const data = await res.json();
        
        // Set main page data
        setMainPageData(data || {
          id: 'main',
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

        // Extract subjects from main page
        if (data.subjects?.subjectsContent) {
          const subjects = data.subjects.subjectsContent
            .map((item: any) => item.url?.split('/').pop())
            .filter((slug: string) => slug);
          setAssignmentSubjects(subjects);
        }
      } catch (error) {
        console.error('Error fetching assignment data:', error);
        setMainPageData({
          id: 'main',
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
      }
    };
    fetchMainPageData();
  }, []);

  // Fetch subject page data when subject is selected
  const handleSubjectChange = async (subject: string) => {
    setSelectedSubject(subject);
    if (subject) {
      setPageLoading(true);
      try {
        const res = await fetch(`/api/admin/assignment?slug=${subject}`);
        const page = await res.json();
        // Ensure both slug and id are set for subject pages
        const pageData = page && Object.keys(page).length > 0 ? {
          ...page,
          slug: page.slug || page.id || subject,
          id: page.id || page.slug || subject
        } : {
          slug: subject,
          id: subject,
          title: '',
          btnText: '',
          heroContent: { mainHeading: '', description: '' },
          academic: { mainheading: '', mainDescription: '', academicContent: [] },
          whyScholarly: { mainHeading: '', mainDescription: '', whyScholarlyContent: [] },
          subjects: { mainHeading: '', subjectsContent: [] },
          meta_title: '',
          meta_description: '',
          status: 'published'
        };
        setSubjectPageData(pageData);
      } catch (error) {
        console.error('Error fetching page:', error);
        setSubjectPageData({
          slug: subject,
          id: subject,
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
      setSubjectPageData(null);
    }
  };

  const handleMainPageSave = async () => {
    if (!mainPageData) return;
    setPageLoading(true);
    try {
      const response = await fetch('/api/admin/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mainPageData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Main page saved successfully!');
        // Refresh subjects list after save
        if (mainPageData.subjects?.subjectsContent) {
          const subjects = mainPageData.subjects.subjectsContent
            .map((item: any) => item.url?.split('/').pop())
            .filter((slug: string) => slug);
          setAssignmentSubjects(subjects);
        }
      } else {
        alert('Error saving main page');
      }
    } catch (error) {
      alert('Error saving main page');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubjectPageSave = async () => {
    if (!subjectPageData) return;
    setPageLoading(true);
    try {
      const response = await fetch('/api/admin/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectPageData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Subject page saved successfully!');
      } else {
        alert('Error saving subject page');
      }
    } catch (error) {
      alert('Error saving subject page');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubjectPageDelete = async () => {
    if (!subjectPageData?.slug) return;
    
    if (!confirm(`Are you sure you want to delete the "${subjectPageData.slug}" subject page? This action cannot be undone.`)) {
      return;
    }

    setPageLoading(true);
    try {
      const response = await fetch(`/api/admin/assignment?slug=${subjectPageData.slug}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        alert('Subject page deleted successfully!');
        setSelectedSubject('');
        setSubjectPageData(null);
        // Refresh subjects list
        const res = await fetch('/api/admin/assignment');
        const data = await res.json();
        if (data.subjects?.subjectsContent) {
          const subjects = data.subjects.subjectsContent
            .map((item: any) => item.url?.split('/').pop())
            .filter((slug: string) => slug);
          setAssignmentSubjects(subjects);
        }
      } else {
        alert('Error deleting subject page');
      }
    } catch (error) {
      alert('Error deleting subject page');
    } finally {
      setPageLoading(false);
    }
  };

  const updateMainPageData = (path: string, value: any) => {
    const keys = path.split('.');
    setMainPageData((prev: any) => {
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

  const updateSubjectPageData = (path: string, value: any) => {
    const keys = path.split('.');
    setSubjectPageData((prev: any) => {
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

  const renderPageForm = (pageData: any, updateFn: (path: string, value: any) => void, saveFn: () => void, deleteFn?: () => void) => {
    if (!pageData) return null;

    return (
      <form onSubmit={(e) => { e.preventDefault(); saveFn(); }} className="space-y-8">
        {/* Basic Info */}
        {pageData.slug && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={pageData.title || ''}
                  onChange={(e) => updateFn('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., English Assignment Help"
                />
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hero Section</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={pageData.btnText || ''}
                onChange={(e) => updateFn('btnText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Get Assignment Help"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.heroContent?.mainHeading || ''}
                onChange={(e) => updateFn('heroContent.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter main heading"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={pageData.heroContent?.description || ''}
                onChange={(e) => updateFn('heroContent.description', e.target.value)}
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
                onChange={(e) => updateFn('academic.mainheading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
              <textarea
                rows={3}
                value={pageData.academic?.mainDescription || ''}
                onChange={(e) => updateFn('academic.mainDescription', e.target.value)}
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
                onChange={(e) => updateFn('whyScholarly.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
              <textarea
                rows={3}
                value={pageData.whyScholarly?.mainDescription || ''}
                onChange={(e) => updateFn('whyScholarly.mainDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Subjects Section - Only show in main page */}
        {!pageData.slug && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Subjects Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
              <input
                type="text"
                value={pageData.subjects?.mainHeading || ''}
                onChange={(e) => updateFn('subjects.mainHeading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Meta and Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO & Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={pageData.meta_title || ''}
                onChange={(e) => updateFn('meta_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={3}
                value={pageData.meta_description || ''}
                onChange={(e) => updateFn('meta_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={pageData.status || 'published'}
                onChange={(e) => updateFn('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          {deleteFn && (
            <button
              type="button"
              onClick={deleteFn}
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Assignment Content</h1>
        <p className="mt-2 text-sm text-gray-600">Edit main page content or manage individual subject pages</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('main')}
              className={`
                ${activeTab === 'main'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              Main Page Content
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`
                ${activeTab === 'subjects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              Subject Pages
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'main' && (
        <div>
          {!mainPageData ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderPageForm(mainPageData, updateMainPageData, handleMainPageSave)
          )}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div>
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

          {!pageLoading && selectedSubject && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Editing:</strong> {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1).replace(/-/g, ' ')}
              </p>
            </div>
          )}

          {subjectPageData && !pageLoading && renderPageForm(subjectPageData, updateSubjectPageData, handleSubjectPageSave, handleSubjectPageDelete)}
        </div>
      )}
    </div>
  );
}
