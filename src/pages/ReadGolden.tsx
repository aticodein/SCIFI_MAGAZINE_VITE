import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fallbackCover from "../assets/images/movie1.jpg";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

export default function ReadGolden() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchGoldenBooks();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        fetchGoldenBooks();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);

  const fetchGoldenBooks = async (search?: string) => {
    setLoading(true);
    try {
      const url = search
        ? `https://openlibrary.org/search.json?q=${encodeURIComponent(search)}&has_fulltext=true&limit=100`
        : "https://openlibrary.org/search.json?subject=science_fiction&has_fulltext=true&limit=100";

      const res = await fetch(url);
      const data = await res.json();

      const formatted = (data.docs || []).map((book: any) => ({
        key: book.key,
        title: book.title,
        author_name: book.author_name || [],
        cover_i: book.cover_i,
      }));

      setBooks(formatted);
      setActiveTab(0);
    } catch (err) {
      console.error("Failed to fetch books", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchGoldenBooks(query);
    }
  };

  const chunked: Array<Array<Book>> = [];
  for (let i = 0; i < books.length; i += 9) {
    chunked.push(books.slice(i, i + 9));
  }

  return (
    <div className="min-h-screen bg-earth-olive text-earth-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 sm:mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Golden Age Sci-Fi Collection</h1>
          <Link
            to="/read"
            className="px-4 py-2 bg-earth-forest text-earth-cream rounded-md shadow hover:bg-earth-clay transition text-sm sm:text-base"
          >
            ← Back to Read
          </Link>
        </div>

        <p className="text-lg text-earth-cream mb-6">
          Explore a curated library of timeless public domain science fiction from the early 20th century. These stories paved the way for the genre as we know it.
        </p>

        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search classic sci-fi by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded px-4 py-2 text-black w-full sm:w-auto"
          />
          <button
            onClick={() => fetchGoldenBooks(query)}
            className="bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-4 py-2 rounded font-semibold"
          >
            Search
          </button>
        </div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {chunked.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-md border shadow text-sm transition-all ${
                index === activeTab
                  ? "bg-brand-yellow text-brand-dark font-bold"
                  : "bg-white text-earth-forest hover:bg-brand-light"
              }`}
            >
              Page {index + 1}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-xl py-12">Loading classic books…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            {chunked[activeTab]?.map((book, i) => (
              <div
                key={book.key}
                className="bg-earth-forest p-6 rounded-2xl text-earth-cream hover:scale-[1.03] transition-transform duration-300 text-center cursor-pointer shadow-lg"
              >
                <img
                  src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : fallbackCover}
                  alt={book.title}
                  className="w-full h-64 object-cover object-top rounded-xl mb-4"
                />
                <h2 className="text-lg sm:text-xl font-bold mb-2">{book.title}</h2>
                <p className="text-sm sm:text-base opacity-80">
                  {book.author_name?.join(", ") || "Unknown Author"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
