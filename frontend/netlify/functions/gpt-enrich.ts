// netlify/functions/gpt-enrich.ts
import { Handler } from "@netlify/functions";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler: Handler = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body || "{}");

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing title or description" }),
      };
    }

    const prompt = `You are a comic book historian. Given the following "${title}", and description, intelligently guess the main characters, at least 6, but do not list the same character with different name, and notable creators, at least 4,gpt-enrich.ts (writers, artists, etc.) even if not explicitly listed. Base your guess on similar comics from the same era or publisher. Always respond in this format:

    Characters: [comma-separated list]
    Creators: [comma-separated list]

    Title: ${title}
    Description: ${description}`;


    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ Works with all OpenAI keys
      messages: [
        {
          role: "system",
          content: "You are a comic book expert. Extract the most likely characters and creators from this comic description.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";

    const characters = content.match(/Characters:\s*(.+)/i)?.[1]?.trim() || "None listed";
    const creators = content.match(/Creators:\s*(.+)/i)?.[1]?.trim() || "Unknown";

    return {
      statusCode: 200,
      body: JSON.stringify({ characters, creators }),
    };
  } catch (error) {
    console.error("GPT Enrich Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to enrich comic details" }),
    };
  }
};

export { handler };
