import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Google GenAI SDK safely. It defaults to using process.env.GEMINI_API_KEY
// but we handle missing keys gracefully in API routes context.
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to client-side rule templates.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate Product Outlines
  app.post("/api/generate-outline", async (req: Request, res: Response): Promise<void> => {
    try {
      const { topic, category, audienceDetails } = req.body;

      if (!topic || !category) {
        res.status(400).json({ error: "Missing topic or category parameters" });
        return;
      }

      if (!ai) {
        // Fallback mockup generator if developer has no key yet
        res.json(getMockOutline(topic, category));
        return;
      }

      const prompt = `Generate a compelling, detailed digital product outline for a product under Coursezy.
      Product Topic: "${topic}"
      Category: "${category}"
      Target Audience Details: "${audienceDetails || 'General creators, self-learners, and professionals'}"
      
      Generate a realistic, practical structure that fits as a premium micro-skill learning asset. Include a Suggested Price in USD (ranging from 5.00 to 49.00 depending on depth).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert online education designer, top-selling digital product consultant, and copywriter.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy, premium product title" },
              tagline: { type: Type.STRING, description: "A compelling one-sentence promise tagline" },
              suggestedPrice: { type: Type.NUMBER, description: "A realistic price in USD (e.g. 19.99)" },
              targetAudience: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 key audience personas who will purchase this"
              },
              highlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 learning or structural highlights of what they will achieve"
              },
              chapters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Highly engaging chapter title" },
                    summary: { type: Type.STRING, description: "A paragraph summary or structured sub-topics of the chapter content" }
                  },
                  required: ["title", "summary"]
                },
                description: "4-5 core chapters, parts, or sections for this digital product"
              }
            },
            required: ["title", "tagline", "suggestedPrice", "targetAudience", "highlights", "chapters"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text from Gemini");
      }

      res.setHeader("Content-Type", "application/json");
      res.send(text);
    } catch (error: any) {
      console.error("Error in generate-outline API:", error);
      res.status(500).json({ error: "Failed to generate outline", details: error.message });
    }
  });

  // API Route: Generate Product Persuasive Copy
  app.post("/api/generate-copy", async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, tagline, category, features } = req.body;

      if (!title || !category) {
        res.status(400).json({ error: "Missing title or category parameters" });
        return;
      }

      if (!ai) {
        // Fallback default mockup sales page copy
        res.json({ copy: getMockSalesCopy(title, tagline || "", category, features || []) });
        return;
      }

      const prompt = `Write a premium, beautiful sales landing page copy in Markdown for our product listed below:
      Product Title: "${title}"
      Category: "${category}"
      Tagline: "${tagline || ''}"
      Key Bullet Points/Features to cover: "${(features || []).join(', ')}"
      
      Structure the copy beautifully with professional headers. Explain with deep value-centric messaging what makes this specific digital asset a must-have, how it saves hours of time, and the immediate downloads they receive. Use bold typeface matching markdown styles. Keep it highly readable and visually striking.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a master direct-response conversion copywriter specializing in Notion templates, professional ebooks, and micro-courses."
        }
      });

      const copy = response.text || "";
      res.json({ copy });
    } catch (error: any) {
      console.error("Error in generate-copy API:", error);
      res.status(500).json({ error: "Failed to generate sales copy", details: error.message });
    }
  });

  // API Route: Smart Assistant recommend products based on user profile/query
  app.post("/api/chat-assistant", async (req: Request, res: Response): Promise<void> => {
    try {
      const { messages, products } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Missing or invalid messages array" });
        return;
      }

      if (!ai) {
        // Fallback client simulation behavior
        res.json({ reply: getMockChatReply(messages, products || []) });
        return;
      }

      const productsSummary = (products || []).map((p: any) => 
        `- ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, Tagline: ${p.tagline}, Price: $${p.price}, Rating: ${p.rating}★`
      ).join("\n");

      const systemInstruction = `You are a helpful, exceptionally friendly, and insightful digital shopping guide for "Coursezy", a marketplace for selling high-converting premium ebooks, beautiful Notion/Figma templates, mini-courses, and practical guides.
      Your primary goal is to guide user's learning or building goals and recommend the most suitable products from Coursezy.
      Available Products at Coursezy Store:
      ${productsSummary || "None listed in catalog yet."}

      Guideline rules:
      - Always recommend specific products from this list that match their queries.
      - Keep responses concise, supportive, and extremely well-formatted (use clear bullets and headers, or bullet points for easy scanning).
      - If they have goals not covered by products, suggest how standard books or templates can aid them, and pitch that Coursezy has other templates coming.
      - Speak strictly in terms of Coursezy's amazing micro-learning opportunities. Avoid developer jargon, and maintain an elite, professional visual retail consultant voice.`;

      // Pass conversation history
      const formattedContents = messages.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction
        }
      });

      const reply = response.text || "I am currently analyzing standard recommendations for you. What kinds of templates or ebooks are you looking to buy?";
      res.json({ reply });
    } catch (error: any) {
      console.error("Error in chat-assistant API:", error);
      res.status(500).json({ error: "Failed to generate dynamic chat answer", details: error.message });
    }
  });

  // Serve static files / Vite middleware integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development environment - mounting Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production environment - serving static assets from dist/...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve fallback index.html for Single Page Applications
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coursezy server running on http://localhost:${PORT}`);
  });
}

// Fallback mockup outline generator for keyless environments
function getMockOutline(topic: string, category: string) {
  const words = topic.split(" ");
  const cleanTopic = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `The Ultimate Guide to ${cleanTopic}`,
    tagline: `Unlock high-quality output and save hundreds of hours with this structured ${category.toLowerCase()}`,
    suggestedPrice: 19.99,
    targetAudience: [
      "Freelancers & Developers looking to scale",
      "Creators creating passive income streams",
      "Ambitious professionals aiming for rapid mastery"
    ],
    highlights: [
      `A fully action-focused step-by-step framework to master ${cleanTopic} in under a weekend`,
      "Pre-configured templates ready to download and deploy instantly",
      "Real-world case studies detailing conversion mechanics and workflow shortcuts"
    ],
    chapters: [
      { title: `Chapter 1: Grounding the Fundamentals of ${cleanTopic}`, summary: "Establish first principles, core parameters, mental mockups, and common amateur errors to avoid." },
      { title: `Chapter 2: Core Execution Architectures`, summary: "An in-depth look into standard setups, templates structure, and maximizing your immediate output." },
      { title: `Chapter 3: Customizing the System for Your Specific Use Cases`, summary: "A step-by-step modular guide to adapting this framework to your personal workflow." },
      { title: `Chapter 4: Scaling Success & Next Milestones`, summary: "How to automate details, optimize conversions, and ensure robust persistent progress over time." }
    ]
  };
}

// Fallback pricing copy planner
function getMockSalesCopy(title: string, tagline: string, category: string, features: string[]) {
  return `## Why Choose ${title}
  
${tagline || 'Master this crucial micro-skill with an expert-engineered roadmap.'}

This specialized **${category.toLowerCase()}** has been meticulously created to solve real, actual friction points in your daily professional or creative life. Instead of wading through hundreds of bloated videos or long books, this direct-to-outcome micro asset takes you straight from zero to expert deployment in one clear sitting.

### Key Benefits
${features.length > 0 
  ? features.map(f => `- **Elite Resource**: ${f}`).join('\n')
  : `- **Saves 80+ Hours**: No fluff, just hard-hitting step-by-step guides.\n- **Direct Implementation**: Real templates and workflows ready to import immediately.\n- **Lifetime Updates**: Receive any new system additions or chapters direct to your library at absolute zero additional charge.`
}

### Inside This Product
This digital asset contains structured content formatted beautifully in Markdown, interactive checklists, copy-pasteable assets code, and links to download fully custom layout views. Perfect for any device, mobile-friendly, and accessible via your Coursezy cloud account library forever.`;
}

// Fallback chat planner
function getMockChatReply(messages: any[], products: any[]) {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const match = products.find(p => lastMsg.includes(p.title.toLowerCase()) || lastMsg.includes(p.category.toLowerCase()));
  
  if (match) {
    return `Excellent choice! The **${match.title}** (${match.category}) is highly recommended. It costs $${match.price} and offers: "${match.tagline}". You can review details right on the storefront or complete a safe sandbox payment to unlock it in your personal Library instantly!`;
  }
  
  return `Hello there! I'm your Coursezy Store Assistant. I can help recommend the best premium items for your specific goals. Currently we have ebooks, interactive minicourses, and templates in categories like Coding, Design, and Business. What specific problem are you looking to solve today?`;
}

startServer();
