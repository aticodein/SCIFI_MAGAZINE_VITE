// netlify/functions/novelAPI.ts
import { Handler } from "@netlify/functions";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler: Handler = async (event) => {
  try {
    const { title, context } = JSON.parse(event.body || "{}");

    const prompt = `You are a science fiction literature expert. Given the following title and a few related keywords or topics, fill in missing metadata.

Format:
Description: ...
Authors: ...
First Published: ...
Themes: ...

Title: ${title}
Context: ${context}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content || "";
    const result: Record<string, string> = {};

    for (const line of text.split("\n")) {
      const [key, ...rest] = line.split(":");
      if (key && rest.length) {
        result[key.trim()] = rest.join(":").trim();
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Enrichment failed", details: err.message }),
    };
  }
};

export { handler };
