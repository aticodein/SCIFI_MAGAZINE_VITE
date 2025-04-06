import React from "react";
import { motion } from "framer-motion";
import "./BookDetails.css";

export default function BookDetails({ book, closeDetails }) {
  return (
    <motion.div
      className="book-details"
      initial={{ opacity: 0, scale: 0.8 }} // Start smaller and transparent
      animate={{ opacity: 1, scale: 1 }} // Grow to full size
      exit={{ opacity: 0, scale: 0.8 }} // Shrink back when exiting
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <h2 className="book-title">{book.title}</h2>
      <p className="book-description">{book.description}</p>
      <motion.button
        className="button close-button"
        onClick={closeDetails}
        whileTap={{ scale: 0.95 }}
      >
        Close
      </motion.button>
    </motion.div>
  );
}