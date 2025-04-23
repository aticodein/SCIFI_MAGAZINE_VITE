// src/components/NovelModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface NovelModalProps {
  novel: any;
  onClose: () => void;
}

const NovelModal: React.FC<NovelModalProps> = ({ novel, onClose }) => {
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    async function fetchWorkDescription() {
      if (!novel?.key) return;
      try {
        const res = await axios.get(`https://openlibrary.org${novel.key}.json`);
        const desc = res.data.description;
        if (typeof desc === "string") setDescription(desc);
        else if (desc?.value) setDescription(desc.value);
        else setDescription("No description available.");
      } catch (err) {
        console.error("Failed to fetch description", err);
        setDescription("No description available.");
      }
    }
    fetchWorkDescription();
  }, [novel]);

  if (!novel) return null;

  const {
    title,
    author_name,
    cover_url,
    subjects,
    first_publish_year,
  } = novel;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-earth-sand text-earth-forest max-w-3xl w-full rounded-xl p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-earth-clay hover:text-earth-olive"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-3 text-center">
          {title}
        </h2>

        {cover_url ? (
          <div className="flex justify-center mb-4">
            <img src={cover_url} alt={title} className="max-h-60 rounded-md shadow-md" />
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="h-60 w-40 bg-earth-clay rounded-md flex items-center justify-center text-sm text-white">
              No Image
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row rounded-md p-4 justify-around bg-earth-cream items-start text-sm text-left gap-2 mb-4">
          <p><span className="font-semibold">Author:</span> {author_name?.join(", ") || "Unknown"}</p>
          <p><span className="font-semibold">First Published:</span> {first_publish_year || "Unknown"}</p>
        </div>

        <div className="bg-white text-black rounded-md p-4 max-h-64 overflow-y-auto mb-4">
          <p className="text-sm whitespace-pre-line leading-relaxed">
            {description || "No description available."}
          </p>
        </div>

        {subjects && subjects.length > 0 && (
          <div className="bg-earth-cream text-black rounded-md p-4 text-sm mb-4">
            <p><span className="font-semibold">Subjects:</span> {subjects.slice(0, 8).join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelModal;
