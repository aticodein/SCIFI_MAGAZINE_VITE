import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BookModal({ book, onClose }) {
  if (!book || !book.volumeInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center px-4">
        <div className="bg-white text-red-600 p-6 rounded-xl shadow-xl">
          <p className="text-center">⚠️ Error: Book data not available.</p>
          <button
            onClick={onClose}
            className="mt-4 bg-brand-yellow text-brand-dark px-4 py-2 rounded-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const info = book.volumeInfo;
  const snippet = info.description || "No detailed information available.";

  const cleanSnippet = snippet
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\n/g, '\n\n');

  const [previewText, setPreviewText] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    const fetchSnippetPreview = async () => {
      if (!info.previewLink) return;
      const bookId = book.id;

      setLoadingPreview(true);
      try {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const previewData = res.data.searchInfo?.textSnippet || res.data.volumeInfo?.description;
        setPreviewText(
          (previewData || "No additional preview content available.")
            .replace(/<[^>]+>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\n/g, '\n\n')
        );
      } catch (error) {
        setPreviewText("No additional preview content available.");
      } finally {
        setLoadingPreview(false);
      }
    };

    if (showPreview) {
      fetchSnippetPreview();
    }
  }, [showPreview, book.id, info.previewLink]);

  const trimmedSnippet = cleanSnippet.length > 180 ? cleanSnippet.slice(0, 180) + "..." : cleanSnippet;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-xl text-earth-forest overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center">{info.title}</h2>
        <p className="text-sm text-center text-gray-700 mb-4">
          {info.authors?.join(", ") || "Unknown Author"}
        </p>

        <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed space-y-2 mb-4">
          {trimmedSnippet}
        </div>

        <div className="border-t pt-4 text-xs text-gray-600 space-y-1">
          {info.publisher && <p><strong>Publisher:</strong> {info.publisher}</p>}
          {info.publishedDate && <p><strong>Published:</strong> {info.publishedDate}</p>}
          {info.pageCount && <p><strong>Pages:</strong> {info.pageCount}</p>}
          {info.categories && (
            <p>
              <strong>Category:</strong> {info.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-brand-yellow text-brand-dark text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                >
                  {cat}
                </span>
              ))}
            </p>
          )}
          {info.averageRating && <p><strong>Rating:</strong> {info.averageRating} / 5</p>}
        </div>

        <div className="mt-6 text-sm text-center">
          {info.previewLink ? (
            <>
              <p className="text-gray-600 italic mb-2">This book may have a preview available.</p>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="mt-2 inline-block bg-brand-yellow text-brand-dark hover:bg-brand-orange transition px-4 py-2 rounded-full font-semibold"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
              {showPreview && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-800 border border-gray-300 max-h-64 overflow-y-auto">
                  {loadingPreview ? (
                    <p className="italic text-gray-500">Loading preview...</p>
                  ) : (
                    <p>{previewText}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">No public preview available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
