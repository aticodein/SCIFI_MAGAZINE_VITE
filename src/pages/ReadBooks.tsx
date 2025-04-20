import React, { useState, useEffect } from "react";
import axios from "axios";
import fallbackCover from "../assets/images/movie1.jpg";
import BookModal from "../components/BookModal";

const preferredAuthors = [
  "asimov",
  "orson scott card",
  "frank herbert",
  "isaac asimov",
  "philip k. dick",
  "ray bradbury",
  "arthur c. clarke",
  "h.g. wells",
  "william gibson",
  "neal stephenson"
];

export default function ReadBooks() {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [modalBook, setModalBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBooksByAuthors() {
      try {
        const authorPromises = preferredAuthors.map((author) =>
          axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(
              author
            )}&maxResults=10`
          )
        );
        const results = await Promise.all(authorPromises);
        const allBooks = results.flatMap((res) => res.data.items || []);
        const uniqueBooks = Array.from(
          new Map(allBooks.map((b) => [b.id, b])).values()
        );
        setBooks(uniqueBooks.slice(0, 100));
        setRecommendedBooks(uniqueBooks.slice(0, 100));
      } catch (err) {
        console.error("Failed to fetch recommended books", err);
      }
    }
    fetchBooksByAuthors();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchQuery.trim()) {
        setBooks(recommendedBooks);
        setActiveTab(0);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, recommendedBooks]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setBooks(recommendedBooks);
      return;
    }
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=40`
      );
      setBooks(res.data.items || []);
      setActiveTab(0);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const chunked = [];
  for (let i = 0; i < books.length; i += 9) {
    chunked.push(books.slice(i, i + 9));
  }

  return (
    <div className="min-h-screen bg-earth-olive px-4 py-12 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-earth-cream">
            Advised Books by Sci-Fi Magazine
          </h1>
          <a
            href="/read"
            className="text-sm text-earth-cream border px-3 py-1 rounded hover:bg-earth-cream hover:text-earth-olive"
          >
            ← Back to Read
          </a>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search Google Books by title, author or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded px-4 py-2 text-black w-full sm:w-auto"
          />
          <button
            onClick={handleSearch}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {chunked[activeTab]?.map((book) => {
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
                      Book cover unavailable
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
