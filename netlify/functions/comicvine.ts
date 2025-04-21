// netlify/functions/comicvine.ts

import axios from "axios";

export const handler = async (event: any) => {
  const category = event.queryStringParameters?.category?.toLowerCase() || "marvel";
  const name = event.queryStringParameters?.name || null;
  console.log("Incoming category:", category);
  console.log("Incoming name:", name);

  const publisherMap: Record<string, number> = {
    dc: 10,
    marvel: 31,
  };

  const publisherId = publisherMap[category];

  if (!publisherId && category !== "others") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid category" }),
    };
  }

  if (category === "others") {
    try {
      const searchTerm = name || "Cowboy Bebop";

      const response = await axios.get("https://api.jikan.moe/v4/anime", {
        params: {
          q: searchTerm,
          limit: 25,
        },
      });

      const items = response.data.data;
      const results: any[] = [];
      const usedTitles = new Set();

      for (const item of items) {
        const title = item.title || item.name || item.titles?.[0]?.title;
        const image = item.images?.jpg?.image_url || item.image_url || item.images?.webp?.image_url;
        const synopsis = item.synopsis || item.about || "No synopsis available.";

        const titleKey = title?.toLowerCase();
        if (!titleKey || usedTitles.has(titleKey)) continue;
        usedTitles.add(titleKey);

        results.push({
          id: `anime-${item.mal_id}`,
          title: title,
          description: synopsis.slice(0, 200),
          image: image || `https://placehold.co/300x400?text=${encodeURIComponent(title)}`,
        });

        if (results.length >= 9) break;
      }

      return {
        statusCode: 200,
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error("Error fetching from Jikan:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch from Jikan API" }),
      };
    }
  }

  try {
    let filter = name ? `name:${name}` : `publisher:${publisherId}`;

    console.log("Using filter:", filter);

    const response = await axios.get("https://comicvine.gamespot.com/api/volumes/", {
      params: {
        api_key: "d98635bc1dfac02c9c9a147d36a3ebe5d8020db8",
        format: "json",
        filter,
        sort: "date_last_issue_focused desc",
        limit: 9,
      },
      headers: {
        "Accept-Encoding": "identity",
      },
    });

    const results = response.data.results.map((comic: any) => ({
      id: comic.id,
      title: comic.name,
      description: comic.description || "No description available.",
      image: comic.image?.original_url || "",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("Error fetching from ComicVine:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch comics" }),
    };
  }
};
