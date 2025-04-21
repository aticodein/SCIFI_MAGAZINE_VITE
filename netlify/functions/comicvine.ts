import axios from "axios";

export const handler = async (event: any) => {
  const category = event.queryStringParameters?.category?.toLowerCase() || "marvel";
  const name = event.queryStringParameters?.name;
  console.log("Incoming category:", category, "name:", name);

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

  // Static mock data for "Others"
  if (category === "others") {
    const mock = Array.from({ length: 9 }, (_, i) => ({
      id: `others-${i}`,
      title: `Cyberpunk Hero ${i + 1}`,
      description: `A cyber-enhanced vigilante from Neo-Tokyo. Volume ${i + 1}`,
      image: "https://placehold.co/300x400?text=Cyberpunk",
    }));
    return {
      statusCode: 200,
      body: JSON.stringify(mock),
    };
  }

  try {
    // Use ComicVine filtering by name or publisher
    const filter = name ? `name:${name}` : `publisher:${publisherId}`;
    console.log("ComicVine filter:", filter);

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
    console.error("ComicVine fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch comics" }),
    };
  }
};
