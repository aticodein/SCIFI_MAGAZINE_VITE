import React from "react";
import { motion } from "framer-motion";
import "./BooksSection.css";

export default function BooksSection({ setShowBooks, sectionVariants }) {
  return (
    <motion.section
      key="books"
      className="books-section"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom="left"
    >
      <h2 className="books-title">Books</h2>
      <div className="books-container">
        {[1, 2, 3, 4].map((book) => (
          <article key={book} className="book-card">
            <h3>Book {book}</h3>
            <p>
              This is a short description of Book {book}. Click to read more.
            </p>
            <motion.button
              className="button read-more-button"
              onClick={() => console.log(`Read more about Book ${book}`)}
              whileTap={{ scale: 0.95 }}
            >
              Read More
            </motion.button>
          </article>
        ))}
      </div>
      <motion.button
        className="button back-button"
        onClick={() => setShowBooks(false)} // Hide the Books Section
        whileTap={{ scale: 0.95 }}
      >
        Back
      </motion.button>
    </motion.section>
  );
}