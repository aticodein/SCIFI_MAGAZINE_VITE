// src/components/NovelModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface NovelModalProps {
  novel: any;
  onClose: () => void;
}

const NovelModal: React.FC<NovelModalProps> = ({ novel, onClose }) => {
  const [enriched, setEnriched] = useState<any>(null);
  const [aiFlags, setAiFlags] = useState({ authors: false, year: false, desc: false, themes: false });

  useEffect(() => {
    if (!novel || enriched) return;
    async function fetchEnrichment() {
      const needsDesc = !novel?.description;
      const needsAuthors = !novel?.author_name?.length;
      const needsYear = !novel?.first_publish_year;
      const needsSubjects = !novel?.subjects?.length;

      if (needsDesc || needsAuthors || needsYear || needsSubjects) {
        try {
          const response = await axios.post("/.netlify/functions/novelAPI", {
            title: novel.title,
            description:
              (Array.isArray(novel.subjects) && novel.subjects.length > 0
                ? novel.subjects.slice(0, 5).join(", ")
                : typeof novel.description === "string"
                ? novel.description
                : "") || "No context provided."
          });

          const data = response.data;
          setEnriched(data);
          setAiFlags({
            authors: needsAuthors && !!data.Authors,
            year: needsYear && !!data["First Published"],
            desc: needsDesc && !!data.Description,
            themes: needsSubjects && !!data.Themes,
          });
        } catch (err) {
          console.error("GPT enrichment failed", err);
        }
      }
    }

    if (novel) fetchEnrichment();
  }, [novel]);

  if (!novel) return null;

  const title = novel.title;
  const authors = novel.author_name?.length ? novel.author_name : enriched?.Authors?.split(",") || [];
  const cover_url = novel.cover_url;
  const subjects = novel.subjects?.length ? novel.subjects : enriched?.Themes?.split(",") || [];
  const first_publish_year = novel.first_publish_year || enriched?.["First Published"] || "Unknown";
  const description =
    typeof novel.description === "string"
      ? novel.description
      : typeof novel.description?.value === "string"
      ? novel.description.value
      : enriched?.Description || "Description loading...";

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
          <p><span className="font-semibold">Author:</span> {authors.join(", ")}
            {aiFlags.authors && <span className="ml-2 text-xs italic text-brand-600">(AI-enriched-text)</span>}</p>
          <p><span className="font-semibold">First Published:</span> {first_publish_year}
            {aiFlags.year && <span className="ml-2 text-xs italic text-brand-600">(AI-enriched-text)</span>}</p>
        </div>

        {description && (
          <div className="bg-white text-black rounded-md p-4 mb-4 text-sm max-h-64 overflow-y-auto">
            <p className="whitespace-pre-line leading-relaxed">
              {description}
              {aiFlags.desc && <span className="block text-xs italic text-brand-600 mt-2">(AI-enriched-text)</span>}
            </p>
          </div>
        )}

        {subjects && subjects.length > 0 && (
          <div className="text-sm flex flex-wrap gap-2">
            {subjects.slice(0, 8).map((subject: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-earth-cream text-black rounded-full text-xs">
                {subject.trim()}
              </span>
            ))}
            {aiFlags.themes && <span className="text-xs italic text-brand-600 ml-2">(AI-enriched-text)</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelModal;
