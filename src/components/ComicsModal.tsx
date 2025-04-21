// src/components/ComicsModal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const enrichWithGPT = async (title: string, description: string) => {
  try {
    const response = await axios.post("/.netlify/functions/gpt-enrich", {
      title,
      description,
      prompt: `You are a comic book historian. Given the following title and description, intelligently guess the main characters and notable creators (writers, artists, etc.) even if not explicitly listed. Base your guess on similar comics from the same era or publisher. Always respond in this format:\n\nCharacters: [comma-separated list]\nCreators: [comma-separated list]\n\nTitle: ${title}\nDescription: ${description}`,
    });
    return response.data;
  } catch (error) {
    console.error("GPT enrichment failed", error);
    return { characters: "None listed", creators: "Unknown" };
  }
};

interface ComicsModalProps {
  comic: any;
  onClose: () => void;
}

export default function ComicsModal({ comic, onClose }: ComicsModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiFlags, setAiFlags] = useState({ characters: false, creators: false });

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);

      // ⛔ Skip ComicVine for Jikan entries
      if (typeof comic?.id === "string" && comic.id.startsWith("anime-")) {
        const cleanDescription = comic.description?.replace(/<[^>]*>?/gm, "") || "No description available.";
  
        const enriched = await enrichWithGPT(comic.title, cleanDescription);
  
        const detailsJikan = {
          name: comic.title,
          publisher: { name: "Jikan API" },
          start_year: "Unknown",
          count_of_issues: "N/A",
          description: cleanDescription,
          image: { original_url: comic.image },
          characters: enriched.characters
            ? enriched.characters.split(",").map((name: string) => ({ name: name.trim() }))
            : [],
          person_credits: enriched.creators
            ? enriched.creators.split(",").map((name: string) => ({ name: name.trim() }))
            : [],
        };
  
        setDetails(detailsJikan);
        setAiFlags({ characters: true, creators: true });
        setLoading(false);
        return;
      }

      try {
        if (comic.source === "jikan") {
          const cleanDescription = comic.synopsis?.replace(/<[^>]*>?/gm, "") || "No description available.";

          const baseDetails = {
            name: comic.title,
            publisher: { name: "Jikan API" },
            start_year: comic.aired?.prop?.from?.year || "Unknown",
            count_of_issues: comic.episodes || "N/A",
            description: cleanDescription,
            image: { original_url: comic.images?.jpg?.large_image_url || comic.images?.jpg?.image_url },
            characters: [],
            person_credits: [],
          };

          const enriched = await enrichWithGPT(comic.title, cleanDescription);
          const newFlags = { characters: false, creators: false };

          if (enriched.characters) {
            baseDetails.characters = enriched.characters.split(",").map((name: string) => ({ name: name.trim() }));
            newFlags.characters = true;
          }
          if (enriched.creators) {
            baseDetails.person_credits = enriched.creators.split(",").map((name: string) => ({ name: name.trim() }));
            newFlags.creators = true;
          }

          setDetails(baseDetails);
          setAiFlags(newFlags);
          setLoading(false);
          return;
        }

        const response = await axios.get(`/.netlify/functions/comicvine?volumeId=${comic.id}`);
        const data = response.data;

        const charactersMissing = !data?.characters || data.characters.length === 0;
        const creatorsMissing = !data?.person_credits || data.person_credits.length === 0;

        const newFlags = { characters: false, creators: false };

        if (charactersMissing || creatorsMissing) {
          const title = comic.title || comic.name || "Unknown Title";
          const rawDescription = comic.description?.replace(/<[^>]*>?/gm, "") || "";

          const enriched = await enrichWithGPT(title, rawDescription);

          if (charactersMissing && enriched.characters) {
            data.characters = enriched.characters.split(",").map((name: string) => ({ name: name.trim() }));
            newFlags.characters = true;
          }

          if (creatorsMissing && enriched.creators) {
            data.person_credits = enriched.creators.split(",").map((name: string) => ({ name: name.trim() }));
            newFlags.creators = true;
          }
        }

        setDetails(data);
        setAiFlags(newFlags);
      } catch (err) {
        console.error("Error fetching comic details:", err);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    }

    if (comic?.id || comic?.mal_id) {
      fetchDetails();
    }
  }, [comic]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const cleanDescription = details?.description || "No additional description available.";
  const title = comic?.title || comic?.name || details?.name || "Unknown Title";
  const publisher = details?.publisher?.name ?? "Unavailable";
  const releaseDate = details?.start_year ?? "Unavailable";
  const pageCount = details?.count_of_issues ?? "Unavailable";
  const volumeImage = details?.image?.original_url || comic?.images?.jpg?.large_image_url || comic?.images?.jpg?.image_url;

  const characters =
    details?.characters?.length > 0
      ? details.characters.map((char: any) => char.name).join(", ")
      : "None listed";

  const creators =
    details?.person_credits?.length > 0
      ? details.person_credits.map((person: any) => person.name).join(", ")
      : "Unknown";

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
          {comic.source === "jikan" && (
            <span className="ml-2 text-sm italic text-brand-600">(Anime)</span>
          )}
        </h2>

        {loading ? (
          <p className="text-center py-8 text-sm italic">Loading comic details…</p>
        ) : (
          <>
            {volumeImage ? (
              <div className="flex justify-center mb-4">
                <img src={volumeImage} alt={title} className="max-h-60 rounded-md shadow-md" />
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="h-60 w-40 bg-earth-clay rounded-md flex items-center justify-center text-sm text-white">
                  No Image
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row rounded-md p-4 justify-around bg-earth-cream items-start text-sm text-left gap-2 mb-4">
              <p><span className="font-semibold">Publisher:</span> {publisher}</p>
              <p><span className="font-semibold">Published:</span> {releaseDate}</p>
              <p><span className="font-semibold">Issues:</span> {pageCount}</p>
            </div>

            <div className="bg-white text-black rounded-md p-4 max-h-64 overflow-y-auto mb-4">
              <p className="text-sm whitespace-pre-line leading-relaxed">
                {cleanDescription}
              </p>
            </div>

            <div className="bg-earth-cream text-black rounded-md p-4 text-sm mb-4">
              <p><span className="font-semibold">Characters:</span> {characters} {aiFlags.characters && <span className="ml-2 px-2 py-0.5 text-xs bg-brand-600 text-earth-clay rounded">AI-enriched</span>}</p>
              <p><span className="font-semibold">Creators:</span> {creators} {aiFlags.creators && <span className="ml-2 px-2 py-0.5 text-xs bg-brand-600 text-earth-clay rounded">AI-enriched</span>}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
