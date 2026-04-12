// src/pages/Create.tsx
import axios from 'axios';
import { FolderKanban, Moon, Settings2, Sparkles, Sun, Wand2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CardGrid from '../components/CardGrid';
import { SessionLogin } from '../components/User/SessionLogin';
import { API_BASE_URL } from '../config/api';
import { clearSessionStoragePreservingPrefs } from '../utils/session';

type CreatorUpload = {
  id: number;
  title: string;
  original_filename: string;
  created_at: string;
  file_url: string;
  preview_url?: string | null;
};

const sampleTools = [
  {
    title: 'AI Comic Script Generator',
    description: 'Generate comic panel ideas and dialogue using your prompt.',
    icon: Wand2,
    badge: 'NEW',
  },
  {
    title: 'Cyberpunk Tone Adjuster',
    description: 'Transform basic text into gritty neon-drenched sci-fi.',
    icon: Sparkles,
  },
  {
    title: 'Character Name Forge',
    description: 'Create original sci-fi hero, villain, or alien names.',
    icon: Settings2,
  },
  {
    title: 'Character Style Forge',
    description: 'Create original sci-fi hero, villain, or alien style.',
    icon: FolderKanban,
  },
];

export default function Create() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('createDarkMode');
    return stored ? JSON.parse(stored) : false;
  });

  const [dashboardOpen, setDashboardOpen] = useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [myUploads, setMyUploads] = useState<CreatorUpload[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<CreatorUpload | null>(null);

  const uploadSectionRef = React.useRef<HTMLDivElement | null>(null);
  const titleInputRef = React.useRef<HTMLInputElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('createDarkMode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-username/`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setUsername(data.username || null);
      } catch {
        setUsername(null);
      }
    }
    fetchUsername();
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      clearSessionStoragePreservingPrefs();
      window.location.reload();
    } catch {
      setUploadError('Failed to logout. Please try again.');
    }
  }

  const loadMyUploads = React.useCallback(async () => {
    if (!username) return;
    setLoadingUploads(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/uploads/mine/`, {
        withCredentials: true,
      });
      setMyUploads(res.data.uploads || []);
    } catch {
      setMyUploads([]);
    } finally {
      setLoadingUploads(false);
    }
  }, [username]);

  useEffect(() => {
    loadMyUploads();
  }, [loadMyUploads]);

  async function handleUpload() {
    setUploadError(null);
    setUploadSuccess(null);

    if (!username) {
      setUploadError('Please create/login a username first.');
      return;
    }
    if (!title.trim()) {
      setUploadError('Title is required.');
      return;
    }
    const selectedFile = fileInputRef.current?.files?.[0] || file;
    if (!selectedFile) {
      setUploadError('Please choose a file (PDF/DOC/DOCX).');
      return;
    }

    const form = new FormData();
    form.append('title', title.trim());
    form.append('file', selectedFile);

    setUploading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/uploads/`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadSuccess('Uploaded successfully.');
      setTitle('');
      await loadMyUploads();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Upload failed.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(upload: CreatorUpload) {
    if (!username) return;
    const ok = window.confirm(
      'Are you sure you want to delete this upload? All your data will be lost.'
    );
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/uploads/${upload.id}/`, {
        withCredentials: true,
      });
      setMyUploads((prev) => prev.filter((u) => u.id !== upload.id));
      if (selectedUpload?.id === upload.id) setSelectedUpload(null);
    } catch {
      setUploadError('Delete failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-earth-olive dark:bg-gray-900 px-4 py-12 transition-colors">
      <div className="bg-earth-cream dark:bg-gray-800 text-gray-800 dark:text-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24 rounded-xl shadow-lg text-center">
        {/* Top Info Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow">
            <strong>Tools Available</strong>
            <p>4 AI tools, more coming soon.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow">
            <strong>Pro-Status</strong>
            <p>Basic User – Upgrade for early access.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow">
            <strong>News</strong>
            <p>Retro Style Generator launching next week.</p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-2 bg-brand-yellow text-brand-dark px-4 py-2 rounded-xl shadow hover:bg-brand-orange transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-semibold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Dashboard Landing */}
        <div className="bg-brand-light dark:bg-gray-700 rounded-2xl border border-earth-sand dark:border-brand-yellow shadow-md px-6 py-8 sm:px-10 sm:py-10 mb-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-brand-dark dark:text-earth-cream">
                Dashboard
              </h2>
              <p className="text-earth-olive-700 dark:text-gray-200 text-sm sm:text-base mt-2">
                Open your creator workspace to upload stories and access creator tools.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setDashboardOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    window.setTimeout(() => {
                      uploadSectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                      window.setTimeout(() => titleInputRef.current?.focus(), 150);
                    }, 0);
                  } else {
                    setSelectedUpload(null);
                  }
                  return next;
                });
              }}
              className="text-base sm:text-lg font-bold text-brand-dark bg-brand-yellow hover:bg-brand-orange transition px-6 py-3 rounded-xl shadow whitespace-nowrap"
              aria-pressed={dashboardOpen}
            >
              Creator Dashboard
            </button>
          </div>

          {username ? (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-earth-olive-700 dark:text-gray-200">
                Logged in as{' '}
                <strong className="text-brand-dark dark:text-earth-cream">{username}</strong>
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-earth-forest text-earth-cream hover:bg-earth-clay transition text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-earth-olive-700 dark:text-gray-200 mb-2">
                Login/create a username to upload.
              </p>
              <SessionLogin onLogin={() => window.location.reload()} />
            </div>
          )}
        </div>

        {dashboardOpen && (
          <>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-brand-dark dark:text-earth-clay mb-6">
              AI Tools for Creators
            </h2>

            <p className="text-earth-olive-700 dark:text-gray-300 max-w-2xl mx-auto underline text-sm sm:text-base mb-10">
              Explore our AI-powered tools to help you create stunning sci-fi content. More features
              coming soon.
            </p>

            {/* Upload Short Novel */}
            <div
              id="creator-upload"
              ref={uploadSectionRef}
              className="bg-white dark:bg-gray-700 rounded-2xl px-4 sm:px-6 py-8 shadow mb-10 text-left border border-black/5 dark:border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark dark:text-earth-cream">
                    Upload Short Novel (PDF / DOC / DOCX)
                  </h3>
                  <p className="text-sm text-earth-olive-700 dark:text-gray-200">
                    Uploaded works appear in the Reader under “User Novels”.
                  </p>
                </div>

                {!username ? (
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-earth-olive-700 dark:text-gray-200 mb-2">
                      Login/create a username to upload.
                    </p>
                    <SessionLogin onLogin={() => window.location.reload()} />
                  </div>
                ) : (
                  <div className="text-sm text-earth-olive-700 dark:text-gray-200">
                    Logged in as:{' '}
                    <strong className="text-brand-dark dark:text-earth-cream">{username}</strong>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input
                    ref={titleInputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Dark Nebula"
                    className="w-full px-4 py-2 rounded bg-earth-cream text-black placeholder:text-sm shadow-md"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold mb-1">File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                      setUploadError(null);
                    }}
                    className="w-full"
                  />
                  {file && (
                    <p className="text-xs mt-1 text-earth-olive-700 dark:text-gray-200">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                <div className="md:col-span-1 flex md:justify-end">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full md:w-auto bg-brand-yellow text-brand-dark px-4 py-2 rounded-xl shadow hover:bg-brand-orange transition font-semibold disabled:opacity-60"
                  >
                    {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              </div>

              {(uploadError || uploadSuccess) && (
                <div className="mt-4">
                  {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                  {uploadSuccess && <p className="text-sm text-green-500">{uploadSuccess}</p>}
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">My Uploads</h4>
                    {username && (
                      <span className="text-xs px-2 py-1 rounded-full bg-earth-forest text-earth-cream">
                        {myUploads.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={loadMyUploads}
                    disabled={!username || loadingUploads}
                    className="text-sm px-3 py-2 rounded-lg bg-brand-light dark:bg-gray-800 border border-earth-sand dark:border-white/10 hover:bg-earth-sand/50 dark:hover:bg-gray-900 transition disabled:opacity-60"
                  >
                    {loadingUploads ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>

                {!username ? (
                  <p className="text-sm text-earth-olive-700 dark:text-gray-200">
                    Login to see your uploads.
                  </p>
                ) : myUploads.length === 0 ? (
                  <p className="text-sm text-earth-olive-700 dark:text-gray-200">No uploads yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {myUploads.map((u) => (
                      <div
                        key={u.id}
                        className="bg-brand-light dark:bg-gray-800 rounded-xl px-4 py-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-earth-sand/60 dark:border-white/10"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-brand-dark dark:text-earth-cream truncate">
                            {u.title}
                          </p>
                          <p className="text-xs text-earth-olive-700 dark:text-gray-300 truncate mt-1">
                            {u.original_filename}
                          </p>
                          <p className="text-[11px] text-earth-olive-700/80 dark:text-gray-300/80">
                            {new Date(u.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedUpload(u)}
                            className="text-sm font-semibold px-4 py-2 rounded-lg bg-earth-forest text-earth-cream hover:bg-earth-clay transition whitespace-nowrap"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedUpload && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                role="dialog"
                aria-modal="true"
              >
                <div className="w-full max-w-5xl bg-earth-cream dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-black/10 dark:border-white/10">
                    <div className="min-w-0">
                      <p className="text-sm opacity-80 truncate">
                        {selectedUpload.original_filename}
                      </p>
                      <h3 className="text-lg sm:text-xl font-bold truncate">
                        {selectedUpload.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={selectedUpload.file_url}
                        className="bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-3 py-2 rounded font-semibold text-sm"
                        download
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedUpload(null)}
                        className="px-3 py-2 rounded bg-earth-forest text-earth-cream hover:bg-earth-clay transition text-sm font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-4">
                    {(() => {
                      const name = (selectedUpload.original_filename || '').toLowerCase();
                      const isPdfOriginal = name.endsWith('.pdf');
                      const previewSrc =
                        selectedUpload.preview_url ||
                        (isPdfOriginal ? selectedUpload.file_url : '');

                      if (previewSrc) {
                        return (
                          <iframe
                            src={previewSrc}
                            title={selectedUpload.title}
                            className="w-full h-[70vh] rounded-lg bg-white"
                          />
                        );
                      }

                      return (
                        <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-4">
                          <p className="text-sm">
                            Preview is available for PDFs. This upload doesn't have a PDF preview
                            yet, so you may need to download it to view.
                          </p>
                          <p className="text-sm mt-2">
                            Tip: export your document as PDF before uploading for the best Reader
                            experience.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Tools Grid */}
            <div className="bg-brand-dark dark:bg-gray-700 px-4 sm:px-6 py-8 sm:py-10 rounded-2xl shadow-xl">
              <CardGrid
                items={sampleTools.map((tool) => ({
                  ...tool,
                  icon: tool.icon ? (
                    <tool.icon size={18} className="text-brand-dark dark:text-brand-dark mb-2" />
                  ) : null,
                  titleClass: 'text-brand-dark dark:text-brand-dark font-bold text-lg',
                }))}
              />
            </div>

            {/* Coming Soon Footer */}
            <p className="mt-6 text-xs text-earth-olive dark:text-gray-400 uppercase tracking-widest">
              COMING SOON
            </p>
          </>
        )}
      </div>
    </div>
  );
}
