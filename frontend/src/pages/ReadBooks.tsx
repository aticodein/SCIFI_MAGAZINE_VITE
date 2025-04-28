// ReadBooks
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import fallbackCover from "../assets/images/movie1.jpg";
import BookModal from "../components/BookModal";
import LoadingBookCard from "../components/LoadingBookCard";

const preferredAuthors = [
  "isaac asimov",
  "orson scott card",
  "frank herbert",
  "istvan nemere",
  "philip k. dick",
  "ray bradbury",
  "arthur c. clarke",
  "h.g. wells",
  "william gibson"
];

export default function ReadBooks() {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [modalBook, setModalBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchBooksByAuthors() {
      try {
        setLoading(true);
        const authorPromises = preferredAuthors.map((author) =>
          axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(author)}&maxResults=10`)
        );
        const results = await Promise.all(authorPromises);
        const allBooks = results.flatMap((res) => res.data.items || []);
        const uniqueBooks = Array.from(new Map(allBooks.map((b) => [b.id, b])).values());
        setBooks(uniqueBooks.slice(0, 100));
        setRecommendedBooks(uniqueBooks.slice(0, 100));
      } catch (err) {
        console.error("Failed to fetch recommended books", err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    }

    fetchBooksByAuthors();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchQuery.trim()) {
        setBooks([...recommendedBooks]);
        setActiveTab(0);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, recommendedBooks]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setBooks([...recommendedBooks]);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setBooks(recommendedBooks);
      return;
    }
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=40`);
      setBooks(res.data.items || []);
      setActiveTab(0);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const chunked: Array<Array<any>> = [];
  for (let i = 0; i < books.length; i += 9) {
    chunked.push(books.slice(i, i + 9));
  }

  return (
    <div className="min-h-screen bg-earth-olive px-4 py-12 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-earth-cream">
            Sci-Fi Magazine's Good Read Library
          </h1>
          <a
            href="/read"
            className="text-sm text-earth-cream border px-3 py-1 rounded hover:bg-earth-cream hover:text-earth-olive"
          >
            ← Back to Read
          </a>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Google Books by title, author or genre..."
              value={searchQuery}
              ref={searchInputRef}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="rounded px-4 py-2 text-black w-full"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-earth-forest text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-brand-yellow transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-4 py-2 rounded font-semibold"
            >
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="bg-earth-forest text-white hover:bg-brand-yellow transition px-4 py-2 rounded font-semibold"
            >
              Clear
            </button>
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <LoadingBookCard key={i} />)
            : chunked[activeTab]?.map((book) => {
                const info = book.volumeInfo;
                const hasImage = info.imageLinks?.thumbnail;
                return (
                  <div
                    key={book.id}
                    className="bg-earth-cream text-earth-forest rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-[1.03] transition cursor-pointer"
                    onClick={() => setModalBook(book)}
                  >
                    <div className="relative w-full h-60 mb-4">
                      <img
                        src={hasImage ? info.imageLinks.thumbnail : fallbackCover}
                        alt={hasImage ? info.title : "Book cover unavailable"}
                        className="w-full h-60 object-contain mb-2 rounded"
                      />
                      {!hasImage && (
                        <p className="text-xs italic text-center text-black -mt-2 mb-2">
                          Book cover unavailable.
                        </p>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-center">
                      {info.title}
                    </h3>
                    <p className="text-sm mb-2 text-center">
                      {info.authors?.join(", ") || "Unknown Author"}
                    </p>
                  </div>
                );
              })}
        </div>

        {modalBook && (
          <BookModal book={modalBook} onClose={() => setModalBook(null)} />
        )}
      </div>
    </div>
  );
}
