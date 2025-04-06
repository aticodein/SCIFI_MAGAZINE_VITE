import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookDetails from "./BookDetails";
import "./BooksSection.css";

export default function BooksSection({ setShowBooks }) {
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    { id: 1, title: "Book 1", description: "This is the description of Book 1." },
    { id: 2, title: "Book 2", description: "This is the description of Book 2." },
    { id: 3, title: "Book 3", description: "This is the description of Book 3." },
    { id: 4, title: "Book 4", description: "This is the description of Book 4." },
  ];

  const handleReadMore = (book) => {
    setSelectedBook(book);
  };

  const closeDetails = () => {
    setSelectedBook(null);
  };

  return (
    <motion.section
      key="books"
      className="books-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="books-title">Books</h2>
      <div className="books-container">
        {books.map((book) => (
          <article key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p>{book.description.substring(0, 50)}...</p>
            <motion.button
              className="button read-more-button"
              onClick={() => handleReadMore(book)}
              whileTap={{ scale: 0.95 }}
            >
              Read More
            </motion.button>
          </article>
        ))}
      </div>
      <motion.button
        className="button back-button"
        onClick={() => setShowBooks(false)}
        whileTap={{ scale: 0.95 }}
      >
        Back
      </motion.button>

      {/* Show BookDetails if a book is selected */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetails book={selectedBook} closeDetails={closeDetails} />
        )}
      </AnimatePresence>
    </motion.section>
  );
}