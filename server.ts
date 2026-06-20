import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse request bodies as JSON
app.use(express.json());

// Initialize Gemini SDK with custom user agent and key loaded server-side
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Decisorial Schema defining structured response format
const decisionSchema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The original decision topic parsed clean" },
    summary: { type: Type.STRING, description: "A detailed 1-2 paragraph executive summarization of the context" },
    verdict: { type: Type.STRING, description: "Clear structured final directive or compromise recommendation" },
    dimensions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-5 key dimensions of focus (e.g. Technology, Cost, Accessibility, Ease of Use, Security)" 
    },
    pros: {
      type: Type.ARRAY,
      description: "List of analytical advantages or positive arguments",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique node ID like pro1, pro2, etc" },
          title: { type: Type.STRING, description: "Concise title of the pro argument" },
          description: { type: Type.STRING, description: "Detailed explanation of why this is a benefit" },
          strength: { type: Type.INTEGER, description: "Influence level from 1 to 5 (5 being massive pro)" },
          dimension: { type: Type.STRING, description: "One of the mapped dimensions" },
          impact: { type: Type.STRING, description: "High, Medium, or Low impact on goal" }
        },
        required: ["id", "title", "description", "strength", "dimension", "impact"]
      }
    },
    cons: {
      type: Type.ARRAY,
      description: "List of risks, costs, drawbacks, or fatal trade-offs",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique node ID like con1, con2, etc" },
          title: { type: Type.STRING, description: "Concise title of the con warning" },
          description: { type: Type.STRING, description: "Detailed explanation of why this is a risk/drawback" },
          severity: { type: Type.INTEGER, description: "Severity score from 1 to 5 (5 being absolute blocker)" },
          dimension: { type: Type.STRING, description: "One of the mapped dimensions" },
          impact: { type: Type.STRING, description: "High, Medium, or Low impact on goal" }
        },
        required: ["id", "title", "description", "severity", "dimension", "impact"]
      }
    },
    swot: {
      type: Type.OBJECT,
      description: "Full SWOT Analysis matrices",
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"]
    },
    comparison: {
      type: Type.OBJECT,
      description: "A clean feature-by-feature comparison table of Option A vs Option B",
      properties: {
        optionAName: { type: Type.STRING, description: "Name of the baseline, status quo, or standard choice" },
        optionBName: { type: Type.STRING, description: "Name of the new proposed, alternative, or streaming choice" },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspect: { type: Type.STRING, description: "The specific metric, aspect, or feature Compared" },
              optionA: { type: Type.STRING, description: "Properties or status of Option A" },
              optionB: { type: Type.STRING, description: "Properties or status of Option B" },
              winner: { type: Type.STRING, description: "Who wins this aspect? Literal 'A', 'B', or 'Tie'" }
            },
            required: ["aspect", "optionA", "optionB", "winner"]
          }
        }
      },
      required: ["optionAName", "optionBName", "rows"]
    },
    graph: {
      type: Type.OBJECT,
      description: "Interactive visual network maps representing connections between the root decision point, dimensions, key pros, and key cons",
      properties: {
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Must match standard node IDs exactly ('root', pro/con item ids, or dimension labels)" },
              label: { type: Type.STRING, description: "Shorthand label displayed inside the circle node (max 20 chars)" },
              type: { type: Type.STRING, description: "Choose 'decision' | 'pro' | 'con' | 'factor'" },
              score: { type: Type.INTEGER, description: "Weight of item (1 to 5)" },
              description: { type: Type.STRING, description: "Tooltip or brief detail of the node" }
            },
            required: ["id", "label", "type", "score", "description"]
          }
        },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING, description: "ID of source node" },
              target: { type: Type.STRING, description: "ID of target node" },
              relationship: { type: Type.STRING, description: "Literal 'supports', 'opposes', or 'neutral'" }
            },
            required: ["source", "target", "relationship"]
          }
        }
      },
      required: ["nodes", "links"]
    }
  },
  required: ["topic", "summary", "verdict", "dimensions", "pros", "cons", "swot", "comparison", "graph"]
};

// API Endpoint for Decision Analysis using Gemini
app.post("/api/decide", async (req, res) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string" || topic.trim() === "") {
    return res.status(400).json({ error: "A valid decision topic must be entered." });
  }

  // Safety fallback if API key is missing
  if (!geminiApiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured on the server-side environment. Please check your Secret keys inside Settings.",
    });
  }

  try {
    const prompt = `You are "The WEB" Decision Intelligence engine. Analyze this decision topic:
"${topic.trim()}"

Break down this decision with strict balance, precision, and depth:
1. Provide a detailed summary and verdict.
2. Outline specific Pros and Cons, scoring their strength/severity on a 1-5 scale and classifying them under specific dimensions of consideration.
3. Supply a classic SWOT analysis matrix.
4. Set up an Option A vs Option B comparison checklist/table. Option A should represent the traditional/Status-Quo approach, and Option B should represent the new alternative/proposed plan.
5. Plan a "Decision Web" node-link network for data layout. Your central node ID must be "root" (with type "decision", representing the core dilemma). Connect the root node to key dimensions or direct factors. Link the pros and cons to their respective dimension nodes or direct targets. Ensure all "source" and "target" IDs in "links" correspond to actual "id" strings in the "nodes" array.

Make your analysis highly insightful and specific to the exact nuances of the user's inquiry. If the user mentions building WhatsApp, streaming vs downloading, or other tech patterns, provide precise developer/UX pros and cons.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are 'The WEB', an advanced visual decision mapping engine. You parse text topics into extremely detailed, comprehensive analytical structures (pros/cons, SWOT, Option A vs B tables, and interactive node link network maps). Keep responses realistic, objective, and deeply professional.",
        responseMimeType: "application/json",
        responseSchema: decisionSchema,
        temperature: 0.1, // Low to maintain structured integrity
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Inquiry processing failed on backend.",
      details: error.message || error.toString(),
    });
  }
});

// Start fullstack configuration
async function initialiseServer() {
  // Vite integration in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend assets in production build
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[The WEB] full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

initialiseServer().catch((err) => {
  console.error("Critical server configuration error:", err);
});
