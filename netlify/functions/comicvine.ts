// netlify/functions/comicvine.ts

import axios from "axios";

export const handler = async (event: any) => {
  const category = event.queryStringParameters?.category?.toLowerCase() || "marvel";
console.log("Incoming category:", category);

const publisherMap: Record<string, number> = {
  dc: 10,
  marvel: 13235,
};

const publisherId = publisherMap[category]; // already lowercased above

if (!publisherId && category !== "others") {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Invalid category" }),
  };
}

  if (category === "others") {
    const mock = Array.from({ length: 9 }, (_, i) => ({
      id: `others-${i}`,
      title: `Cyberpunk Saga ${i + 1}`,
      description: `An underground manga epic set in Neo-Tokyo. Volume ${i + 1}`,
      image: "https://placehold.co/300x400?text=Cyberpunk",
    }));
    return {
      statusCode: 200,
      body: JSON.stringify(mock),
    };
  }

  try {
    let filter = "";
  
    if (category === "marvel") {
      filter = "name:Iron Man"; // Or "name:Spider-Man", "name:Iron Man", etc.
    } else {
      filter = `publisher:${publisherId}`;
    }
  
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
