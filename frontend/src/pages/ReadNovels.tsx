// src/pages/ReadNovels.tsx
import React, { useEffect, useState } from "react";
import NovelModal from "../components/NovelModal";
import LoadingCard from "../components/LoadingCard";
import { Link } from "react-router-dom";

interface Novel {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  description?: string | { value: string };
  cover_url?: string;
  subjects?: string[];
}

export default function ReadNovels() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState("science_fiction");
  const [selected, setSelected] = useState<Novel | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [query, setQuery] = useState("");

  const genreOptions = [
    { label: "Hard Sci-Fi", value: "hard_science_fiction" },
    { label: "Time Travel", value: "time_travel" },
    { label: "Space Opera", value: "space_opera" },
    { label: "Dystopian", value: "dystopias" },
    { label: "Cyberpunk", value: "cyberpunk" },
    { label: "Classic Sci-Fi", value: "science_fiction" },
  ];

  const themeOptions = [
    "Utopias",
    "Aliens",
    "Robots",
    "Genetics",
    "War",
    "Time Travel",
    "Philosophy",
    "Politics",
  ];

  const fetchNovelsByGenre = async (genre: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/subjects/${genre}.json?limit=18`);
      const data = await response.json();

      const formatted = (data.works || []).map((novel: any) => ({
        key: novel.key,
        title: novel.title,
        author_name: novel.authors?.map((a: any) => a.name) || [],
        cover_url: novel.cover_id
          ? `https://covers.openlibrary.org/b/id/${novel.cover_id}-L.jpg`
          : "https://placehold.co/300x400?text=No+Cover",
        first_publish_year: novel.first_publish_year,
        description: novel.description || null,
        subjects: novel.subject || [],
      }));

      setNovels(formatted);
    } catch (err) {
      console.error("Failed to load novels:", err);
      setNovels([]);
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async () => {
    if (!query.trim()) {
      fetchNovelsByGenre(activeGenre);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=18`);
      const data = await res.json();

      const formatted = (data.docs || []).map((novel: any) => ({
        key: novel.key,
        title: novel.title,
        author_name: novel.author_name || [],
        cover_url: novel.cover_i
          ? `https://covers.openlibrary.org/b/id/${novel.cover_i}-L.jpg`
          : "/src/assets/images/movie2.jpg",
        first_publish_year: novel.first_publish_year,
        description: novel.subtitle || novel.notes || null,
        subjects: novel.subject || [],
      }));

      setNovels(formatted);
    } catch (err) {
      console.error("Search failed:", err);
      setNovels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      fetchNovelsByGenre(activeGenre);
    }
  }, [activeGenre]);

  const filteredNovels = novels.filter((novel) => {
    if (!selectedTheme) return true;
    return novel.subjects?.some((s) => s.toLowerCase().includes(selectedTheme.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 px-2">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
            Novels Worth a Look – Some Greats, Not All
          </h1>
          <Link
            to="/read"
            className="px-4 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition text-sm sm:text-base"
          >
            ← Back to Read
          </Link>
        </div>

        <div className="mb-6 px-2 w-full flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search novels by title, author, keywords..."
            className="w-full px-4 py-2 rounded bg-earth-cream text-black placeholder:text-sm shadow-md"
          />
          <button
            onClick={searchBooks}
            className="bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-4 py-2 rounded font-semibold"
          >
            Search
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 px-2 relative z-10">
          <div className="flex flex-wrap gap-3">
            {genreOptions.map((genre) => (
              <button
                key={genre.value}
                onClick={() => setActiveGenre(genre.value)}
                className={`px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-200 text-sm sm:text-base hover:scale-105 ${
                  activeGenre === genre.value
                    ? "bg-white text-earth-forest border-2 border-earth-clay"
                    : "bg-earth-forest text-earth-cream"
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>

          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="sm:ml-auto pl-3 pr-6 py-2 rounded-lg bg-earth-forest text-earth-cream shadow border border-earth-clay text-sm sm:text-base w-fit"
          >
            <option value="">All Themes</option>
            {themeOptions.map((theme, idx) => (
              <option key={idx} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white text-lg sm:text-xl font-semibold">
            Loading Novels…
          </div>
        )}

        <div key={activeGenre} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <LoadingCard key={i} />)
            : filteredNovels.map((novel) => (
                <div
                  key={novel.key}
                  className="bg-earth-forest p-6 rounded-2xl text-earth-cream hover:scale-[1.03] transition-transform duration-300 text-center cursor-pointer shadow-lg"
                  onClick={() => setSelected(novel)}
                >
                  {novel.cover_url && (
                   <div className="relative w-full h-64 mb-4">
                     <img
                       src={novel.cover_url}
                       alt={novel.title}
                       className="w-full h-full object-cover object-top rounded-xl"
                       />
                     {novel.cover_url.includes('movie2') && (
                     <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm bg-black/60 rounded-xl">
                       Book cover unavailable
                      </span>
                           )}
                        </div>
)}
                  <h2 className="text-lg sm:text-xl font-bold mb-2">{novel.title}</h2>
                  {novel.description && (
                    <p className="text-sm sm:text-base opacity-80">
                      {typeof novel.description === 'string'
                        ? novel.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
                        : (novel.description.value || "").replace(/<[^>]*>?/gm, "").slice(0, 160)}
                    </p>
                  )}
                </div>
              ))}
        </div>

        {selected && <NovelModal novel={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
