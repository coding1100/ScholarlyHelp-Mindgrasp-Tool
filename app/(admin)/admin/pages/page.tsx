"use client";

import { useState, useEffect } from "react";

interface Page {
  id?: number;
  category: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: string;
}

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const res = await fetch('/api/admin/pages');
    const data = await res.json();
    setPages(data);
  };

  const handleSave = async (page: Page) => {
    setLoading(true);
    await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });
    setLoading(false);
    setEditingPage(null);
    fetchPages();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
    fetchPages();
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Pages</h1>
        <p className="mt-2 text-sm text-gray-600">Create and edit dynamic pages</p>
      </div>

      <button
        onClick={() => setEditingPage({ category: '', title: '', slug: '', content: '', meta_title: '', meta_description: '', status: 'published' })}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add New Page
      </button>

      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="border p-4 rounded">
            <h3 className="text-lg font-semibold">{page.title}</h3>
            <p>Category: {page.category}, Slug: {page.slug}</p>
            <button onClick={() => setEditingPage(page)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
            <button onClick={() => handleDelete(page.id!)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
      </div>

      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <h2 className="text-xl mb-4">{editingPage.id ? 'Edit Page' : 'Add Page'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(editingPage); }}>
              <input
                type="text"
                placeholder="Category"
                value={editingPage.category}
                onChange={(e) => setEditingPage({ ...editingPage, category: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Slug"
                value={editingPage.slug}
                onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <textarea
                placeholder="Content (HTML)"
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
                rows={4}
              />
              <input
                type="text"
                placeholder="Meta Title"
                value={editingPage.meta_title}
                onChange={(e) => setEditingPage({ ...editingPage, meta_title: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Meta Description"
                value={editingPage.meta_description}
                onChange={(e) => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              />
              <select
                value={editingPage.status}
                onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value })}
                className="w-full mb-2 p-2 border rounded"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditingPage(null)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}