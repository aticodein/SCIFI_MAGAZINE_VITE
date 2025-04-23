// src/components/NovelModal.tsx
import React from "react";

interface NovelModalProps {
  novel: any;
  onClose: () => void;
}

const NovelModal: React.FC<NovelModalProps> = ({ novel, onClose }) => {
  if (!novel) return null;

  const {
    title,
    author_name,
    description,
    cover_url,
    subjects,
    first_publish_year,
  } = novel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-earth-sand text-earth-forest rounded-xl shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-earth-clay hover:text-earth-olive"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {title}
        </h2>

        {cover_url && (
          <div className="flex justify-center mb-4">
            <img src={cover_url} alt={title} className="max-h-60 rounded shadow" />
          </div>
        )}

        <div className="text-sm mb-4 text-center">
          <p><span className="font-semibold">Author:</span> {author_name?.join(", ") || "Unknown"}</p>
          <p><span className="font-semibold">First Published:</span> {first_publish_year || "Unknown"}</p>
        </div>

        {description && (
          <div className="bg-white text-black rounded-md p-4 mb-4 text-sm max-h-64 overflow-y-auto">
            <p className="whitespace-pre-line leading-relaxed">
              {typeof description === "string" ? description : description?.value || ""}
            </p>
          </div>
        )}

        {subjects && subjects.length > 0 && (
          <div className="text-sm flex flex-wrap gap-2">
            {subjects.slice(0, 8).map((subject: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-earth-cream text-black rounded-full text-xs">
                {subject}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelModal;
