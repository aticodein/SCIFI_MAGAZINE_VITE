import React, { useEffect, useState } from "react";
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
  "neal stephenson",
];

export default function ReadBooks() {
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function fetchBooksByAuthors() {
      try {
        const authorPromises = preferredAuthors.map((author) =>
          axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(
              author
            )}+subject:science-fiction&maxResults=10&printType=books&langRestrict=en`
          )
        );

        const results = await Promise.all(authorPromises);
        const allBooks = results.flatMap((res) => res.data.items || []);

        const uniqueBooks = Array.from(
          new Map(allBooks.map((b) => [b.id, b])).values()
        );

        setBooks(uniqueBooks.slice(0, 100));
        setLoading(false);
      } catch (err) {
        setError("Failed to load books");
        setLoading(false);
      }
    }

    fetchBooksByAuthors();
  }, []);

  const chunked = [];
  for (let i = 0; i < books.length; i += 9) {
    chunked.push(books.slice(i, i + 9));
  }

  return (
    <div className="min-h-screen bg-earth-olive px-4 py-12 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-earth-cream">Advised Books by Sci-Fi Magazine</h1>
          <a
            href="/read"
            className="text-sm text-earth-cream border px-3 py-1 rounded hover:bg-earth-cream hover:text-earth-olive"
          >
            ← Back to Read
          </a>
        </div>

        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
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
              {chunked[activeTab].map((book) => {
                const info = book.volumeInfo;
                const hasImage = info.imageLinks?.thumbnail;
                return (
                  <div
                    key={book.id}
                    className="bg-earth-cream text-earth-forest rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-[1.03] transition"
                  >
                    <div className="relative w-full h-60 mb-1">
                      <img
                        src={hasImage ? info.imageLinks.thumbnail : fallbackCover}
                        alt={hasImage ? info.title : "Book cover unavailable"}
                        className="w-full h-60 object-contain rounded"
                      />
                      {!hasImage && (
                        <p className="text-xs italic text-center text-white mt-1 absolute bottom-1 left-1/2 transform -translate-x-1/2">
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
                    {info.description && (
                      <p className="text-xs text-center text-gray-600 italic mb-2 line-clamp-4">
                        {info.description.substring(0, 160)}...
                      </p>
                    )}
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="text-sm bg-brand-yellow text-brand-dark px-4 py-1 mt-auto rounded hover:bg-brand-orange transition shadow"
                    >
                      Read More
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal */}
            {selectedBook && (
              <BookModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                showImage={false} // Hide image in modal
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
