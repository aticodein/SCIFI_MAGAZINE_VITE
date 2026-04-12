import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

type PublicUpload = {
  id: number;
  username: string;
  title: string;
  original_filename: string;
  created_at: string;
  file_url: string;
  preview_url?: string | null;
};

export default function ReadUserNovels() {
  const [uploads, setUploads] = useState<PublicUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PublicUpload | null>(null);
  const [view, setView] = useState<'novels' | 'users' | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/uploads/public/`);
        setUploads(res.data.uploads || []);
      } catch {
        setError('Failed to load user novels.');
        setUploads([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const uploadsByTitle = uploads
    .slice()
    .sort((a, b) =>
      (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' })
    );

  const userCounts = uploads.reduce<Record<string, number>>((acc, u) => {
    const key = u.username || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const users = Object.keys(userCounts).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  const uploadsForSelectedUser = selectedUser
    ? uploadsByTitle.filter((u) => (u.username || 'Unknown') === selectedUser)
    : [];

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 px-2">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
            User Novels – Uploaded by Creators
          </h1>
          <Link
            to="/read"
            className="px-4 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition text-sm sm:text-base"
          >
            ← Back to Read
          </Link>
        </div>

        {loading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white text-lg sm:text-xl font-semibold">
            Loading User Novels…
          </div>
        )}

        {error && (
          <div className="px-2 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && uploads.length === 0 && (
          <div className="px-2">
            <p className="text-earth-cream/80">No uploads yet.</p>
          </div>
        )}

        {!loading && !error && uploads.length > 0 && (
          <div className="px-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <div className="inline-flex rounded-xl overflow-hidden border border-earth-sand/30">
                <button
                  type="button"
                  onClick={() => {
                    setView('novels');
                    setSelectedUser(null);
                  }}
                  className={
                    'px-4 py-2 text-sm font-semibold transition ' +
                    (view === 'novels'
                      ? 'bg-brand-yellow text-brand-dark'
                      : 'bg-earth-forest text-earth-cream hover:bg-earth-clay')
                  }
                >
                  Novels
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('users');
                    setSelectedUser(null);
                  }}
                  className={
                    'px-4 py-2 text-sm font-semibold transition ' +
                    (view === 'users'
                      ? 'bg-brand-yellow text-brand-dark'
                      : 'bg-earth-forest text-earth-cream hover:bg-earth-clay')
                  }
                >
                  Users
                </button>
              </div>

              {view === null && (
                <p className="text-sm text-earth-cream/80">
                  Choose <strong>Novels</strong> or <strong>Users</strong> to browse.
                </p>
              )}
            </div>

            {view === 'novels' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadsByTitle.map((u) => (
                  <div
                    key={u.id}
                    className="bg-earth-forest p-6 rounded-2xl text-earth-cream hover:scale-[1.03] transition-transform duration-300 text-left shadow-lg"
                  >
                    <h2 className="text-lg sm:text-xl font-bold mb-2">{u.title}</h2>
                    <p className="text-sm opacity-80 mb-4">
                      By <strong>{u.username}</strong>
                    </p>
                    <p className="text-xs opacity-70 truncate mb-4">{u.original_filename}</p>

                    {u.file_url ? (
                      <button
                        type="button"
                        onClick={() => setSelected(u)}
                        className="inline-block bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-4 py-2 rounded font-semibold"
                      >
                        Open
                      </button>
                    ) : (
                      <span className="inline-block px-4 py-2 rounded bg-earth-clay/40 text-earth-cream/70">
                        Unavailable
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {view === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <div className="bg-earth-forest rounded-2xl shadow-lg p-4">
                    <h2 className="text-base font-bold mb-3">Users</h2>
                    <div className="max-h-[60vh] overflow-auto pr-1">
                      {users.map((name) => {
                        const active = selectedUser === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => setSelectedUser(name)}
                            className={
                              'w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between gap-3 ' +
                              (active
                                ? 'bg-brand-yellow text-brand-dark'
                                : 'bg-black/10 hover:bg-black/20 text-earth-cream')
                            }
                          >
                            <span className="truncate font-semibold">{name}</span>
                            <span
                              className={
                                'text-xs px-2 py-1 rounded-full ' +
                                (active ? 'bg-brand-dark/10' : 'bg-earth-clay/40')
                              }
                            >
                              {userCounts[name]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {selectedUser ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-bold">
                          Novels by <span className="text-brand-yellow">{selectedUser}</span>
                        </h2>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(null)}
                          className="text-sm underline text-earth-cream/80 hover:text-earth-cream"
                        >
                          Clear
                        </button>
                      </div>
                      {uploadsForSelectedUser.length === 0 ? (
                        <p className="text-earth-cream/80">No uploads for this user.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {uploadsForSelectedUser.map((u) => (
                            <div
                              key={u.id}
                              className="bg-earth-forest p-6 rounded-2xl text-earth-cream hover:scale-[1.03] transition-transform duration-300 text-left shadow-lg"
                            >
                              <h2 className="text-lg font-bold mb-2">{u.title}</h2>
                              <p className="text-xs opacity-70 truncate mb-4">
                                {u.original_filename}
                              </p>
                              {u.file_url ? (
                                <button
                                  type="button"
                                  onClick={() => setSelected(u)}
                                  className="inline-block bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-4 py-2 rounded font-semibold"
                                >
                                  Open
                                </button>
                              ) : (
                                <span className="inline-block px-4 py-2 rounded bg-earth-clay/40 text-earth-cream/70">
                                  Unavailable
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-earth-forest/40 rounded-2xl p-6">
                      <p className="text-earth-cream/90 text-sm">
                        Select a user to see their uploaded novels.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-5xl bg-earth-cream dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-black/10 dark:border-white/10">
                <div className="min-w-0">
                  <p className="text-sm opacity-80 truncate">{selected.original_filename}</p>
                  <h3 className="text-lg sm:text-xl font-bold truncate">{selected.title}</h3>
                  <p className="text-xs opacity-70">By {selected.username}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={selected.file_url}
                    className="bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-3 py-2 rounded font-semibold text-sm"
                    download
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-3 py-2 rounded bg-earth-forest text-earth-cream hover:bg-earth-clay transition text-sm font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4">
                {(() => {
                  const name = (selected.original_filename || '').toLowerCase();
                  const isPdfOriginal = name.endsWith('.pdf');
                  const previewSrc =
                    selected.preview_url || (isPdfOriginal ? selected.file_url : '');

                  if (previewSrc) {
                    return (
                      <iframe
                        src={previewSrc}
                        title={selected.title}
                        className="w-full h-[70vh] rounded-lg bg-white"
                      />
                    );
                  }

                  return (
                    <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-sm">
                        Preview is available for PDFs. This upload doesn't have a PDF preview yet,
                        so you may need to download it to view.
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
      </div>
    </div>
  );
}
