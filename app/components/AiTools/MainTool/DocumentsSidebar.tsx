"use client";
import React, { useMemo, useState } from "react";
import { HiMiniPlus } from "react-icons/hi2";

export interface DocumentItem {
  id: string | number;
  title: string;
  updatedAt: string | number | Date; // ISO, timestamp, or Date
}

interface DocumentsSidebarProps {
  documents?: DocumentItem[];
  onNew?: () => void;
  onSelect?: (id: DocumentItem["id"]) => void;
  className?: string;
}

const formatRelative = (dateLike: string | number | Date) => {
  const date = new Date(dateLike);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${minutes || 1} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
};

const fallbackDocs: DocumentItem[] = [
  {
    id: 1,
    title: "Untitled",
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Desire or Want",
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Machine Learning Overview",
    updatedAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Teacher’s Influence and Impact",
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Data Structures and Algorithms",
    updatedAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000),
  },
];

const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({
  documents,
  onNew,
  onSelect,
  className,
}) => {
  const [query, setQuery] = useState("");
  const docs = documents && documents.length > 0 ? documents : fallbackDocs;

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? docs.filter((d) => d.title.toLowerCase().includes(q))
      : docs;
    return list.slice(0, 4); // show only 3–4, cap at 4
  }, [docs, query]);

  return (
    <aside
      className={`w-72 bg-white border-r h-full flex flex-col ${
        className || ""
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Documents</h2>
        <button
          onClick={onNew}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
          aria-label="New document"
        >
          <HiMiniPlus className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 py-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs..."
          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filteredDocs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect && onSelect(doc.id)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
          >
            <div className="text-sm font-medium text-gray-900 truncate">
              {doc.title}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatRelative(doc.updatedAt)}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default DocumentsSidebar;
