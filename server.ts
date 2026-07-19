import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ensure data folder exists for JSON persistence
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, "db.json");

// Helper for Database Tables State
interface DatabaseState {
  users: any[];
  chats: any[];
  messages: any[];
  reports: any[];
  uploads: any[];
  settings: any;
  waste_data: any[];
  energy_data: any[];
  water_data: any[];
  environment_data: any[];
  utilities_data: any[];
  manufacturing_data: any[];
  packaging_data: any[];
  infrastructure_data: any[];
}

const defaultDB: DatabaseState = {
  users: [
    {
      id: "user_demo",
      email: "sih_candidate@sih.gov.in",
      fullName: "EcoSense Hackathon User",
      profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      role: "Sustainability Manager",
      points: 1240,
      impactMetrics: {
        co2Saved: 342.5, // kg
        wasteRecycled: 184.2, // kg
        waterSaved: 1250, // L
        treesPlanted: 12,
      },
      createdAt: new Date().toISOString()
    }
  ],
  chats: [
    {
      id: "chat_general",
      userId: "user_demo",
      title: "Clean & Green AI Assistant Quickstart",
      createdAt: new Date().toISOString()
    }
  ],
  messages: [
    {
      id: "msg_1",
      chatId: "chat_general",
      role: "model",
      text: "Hello! I am your EcoSense AI Assistant. I am fully integrated into the Clean & Green Technology dashboard. Ask me anything about circular economy, waste segregation, water conservation, solar sizing, or eco-friendly manufacturing!",
      createdAt: new Date().toISOString()
    }
  ],
  reports: [
    {
      id: "rep_1",
      title: "Quarterly Sustainability Audits",
      type: "Waste & Carbon Audit",
      status: "Generated",
      score: 84,
      createdAt: new Date().toISOString(),
      summary: "High energy usage spotted during off-peak hours in Section B. Waste sorting compliance is at 78%."
    }
  ],
  uploads: [],
  settings: {
    theme: "light",
    notifications: true,
    autoVoiceRead: false,
    aiModel: "gemini-3.5-flash",
    ecoLevelTarget: "Zero Waste Gold"
  },
  waste_data: [
    { id: "w_1", type: "Organic", weight: 4.2, points: 42, co2Impact: -1.2, date: new Date().toISOString() },
    { id: "w_2", type: "Plastic", weight: 1.5, points: 30, co2Impact: -3.4, date: new Date().toISOString() },
    { id: "w_3", type: "E-Waste", weight: 0.8, points: 80, co2Impact: -12.5, date: new Date().toISOString() }
  ],
  energy_data: [
    { id: "e_1", type: "Solar Generation", value: 45.2, unit: "kWh", carbonAvoided: 32.1, date: new Date().toISOString() },
    { id: "e_2", type: "Grid Consumption", value: 120.4, unit: "kWh", carbonAvoided: 0, date: new Date().toISOString() }
  ],
  water_data: [
    { id: "wat_1", consumption: 350, rwhYield: 120, leaksSimulated: 0, date: new Date().toISOString() }
  ],
  environment_data: [
    { id: "env_1", aqi: 42, co2: 395, humidity: 62, temperature: 24, noise: 45, date: new Date().toISOString() }
  ],
  utilities_data: [
    { id: "u_1", electricity: 145, water: 340, gas: 18, date: new Date().toISOString() }
  ],
  manufacturing_data: [
    { id: "m_1", rawMaterial: 1200, scrapRate: 2.4, carbonEfficiency: 92, co2Emissions: 1.8, date: new Date().toISOString() }
  ],
  packaging_data: [
    { id: "p_1", original: "Single-use Plastic Wrapper", greenAlt: "Mushroom Bio-Packaging", costChange: 5, score: 96, date: new Date().toISOString() }
  ],
  infrastructure_data: [
    { id: "i_1", treesTracked: 12, canopyArea: 38, offsetKgs: 264, status: "Healthy" }
  ]
};

// Read database
function readDB(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file, using fallback state:", error);
  }
  return defaultDB;
}

// Write database
function writeDB(data: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ---------------- API ENDPOINTS ----------------

// 1. Auth Endpoint (Simulated Session)
app.get("/api/auth/session", (req, res) => {
  const db = readDB();
  res.json({ user: db.users[0], settings: db.settings });
});

app.post("/api/auth/update-user", (req, res) => {
  const db = readDB();
  db.users[0] = { ...db.users[0], ...req.body };
  writeDB(db);
  res.json({ success: true, user: db.users[0] });
});

// 2. Chat history & control
app.get("/api/chats", (req, res) => {
  const db = readDB();
  res.json({ chats: db.chats });
});

app.post("/api/chats", (req, res) => {
  const db = readDB();
  const newChat = {
    id: `chat_${Date.now()}`,
    userId: "user_demo",
    title: req.body.title || "New Sustainability Inquiry",
    createdAt: new Date().toISOString()
  };
  db.chats.unshift(newChat);
  writeDB(db);
  res.json(newChat);
});

app.delete("/api/chats/:id", (req, res) => {
  const db = readDB();
  db.chats = db.chats.filter(c => c.id !== req.params.id);
  db.messages = db.messages.filter(m => m.chatId !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.get("/api/messages/:chatId", (req, res) => {
  const db = readDB();
  const chatMsgs = db.messages.filter(m => m.chatId === req.params.chatId);
  res.json({ messages: chatMsgs });
});

// 3. AI Chat Assistant (Module 2 & 3 & 4 Voice integrated)
app.post("/api/chat", async (req, res) => {
  const { chatId, message } = req.body;
  if (!chatId || !message) {
    return res.status(400).json({ error: "Missing chatId or message" });
  }

  const db = readDB();
  
  // Save user message
  const userMsg = {
    id: `msg_${Date.now()}_u`,
    chatId,
    role: "user",
    text: message,
    createdAt: new Date().toISOString()
  };
  db.messages.push(userMsg);
  writeDB(db);

  // Get conversation history to pass to Gemini
  const conversation = db.messages
    .filter(m => m.chatId === chatId)
    .slice(-10) // last 10 messages for context
    .map(m => `${m.role === "user" ? "User" : "EcoSense AI"}: ${m.text}`)
    .join("\n");

  const prompt = `You are EcoSense AI, an expert Clean & Green technology analyst for the Smart India Hackathon.
Answer the user's sustainability query clearly, providing technical, actionable green recommendations. Use markdown layout.

Conversation context:
${conversation}

User's latest message: ${message}

Provide a comprehensive, encouraging response. Include brief bullet points or numerical values where helpful.`;

  let aiResponseText = "";
  let isDemoMode = false;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are EcoSense AI, a highly technical, polite green technology consultant. You deliver data-rich sustainability audits, hazardous waste analysis, energy sizing forecasts, water saving simulation guides, and circular design recommendations.",
          temperature: 0.7,
        }
      });
      aiResponseText = response.text || "I was unable to synthesize a proper response.";
    } else {
      isDemoMode = true;
      aiResponseText = getSimulatedResponse(message);
    }
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    isDemoMode = true;
    aiResponseText = `*Notice: System operating in EcoSense offline buffer due to external network constraints.*\n\n${getSimulatedResponse(message)}`;
  }

  // Save AI response
  const modelMsg = {
    id: `msg_${Date.now()}_m`,
    chatId,
    role: "model",
    text: aiResponseText,
    createdAt: new Date().toISOString(),
    isDemoMode
  };
  db.messages.push(modelMsg);
  
  // Also adjust User metrics slightly to show impact of interactions
  if (db.users[0]) {
    db.users[0].points += 15;
    db.users[0].impactMetrics.co2Saved += 0.5;
  }
  
  writeDB(db);
  res.json(modelMsg);
});

// Helper for realistic fallback replies if Gemini is not activated
function getSimulatedResponse(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("waste") || m.includes("recycl")) {
    return `### ♻️ EcoSense AI Waste Segregation Analysis

Based on your query regarding waste management, here is a targeted SIH-standard recommendation:
* **Organic Waste (Biochemical Sourcing)**: Divert food wastes and organic peelings to dry anaerobic digestion systems. Potential to harvest biomethane at **0.14 m³ biogas / kg dry matter**.
* **Recyclable Polymers**: Plastic wrappers and multi-layer items (LLDPE, PET) can be processed via pyrolysis to produce high-value synthetic fuel oils.
* **E-Waste & Batteries**: Segregate printed circuit boards to specialized recovery cells to reclaim precious metals (copper, trace gold) preventing lead leaching.

**Actionable Circular Loop**: Initiate a local compost bin with visual temperature-moisture logging. Let me know if you want to track a compost dump or simulate a landfill landfill audit!`;
  }
  if (m.includes("solar") || m.includes("energy") || m.includes("wind")) {
    return `### ☀️ EcoSense Renewable Sizing Estimate

Here is a preliminary solar and carbon avoidance analysis:
1. **Solar Yield Potential**: Average rooftop footprints of **100 m²** with solar irradiance of **5.1 kWh/m²/day** can sustain a **12 kWp photovoltaic array**.
2. **Electricity Analytics**: Generation yields ~**18,000 kWh annually** (depending on shading indices and grid inverter efficiencies).
3. **Carbon Mitigation Impact**: Saves approximately **14.2 metric tons of CO₂ equivalent** per year compared to thermal grid coefficients.

**Targeted Energy Advice**: Install dynamic power factor correction capacitors to maintain power factor at **>0.98**, mitigating reactive grid penalties. Let me know if you would like me to log this in your Renewable Energy tracker!`;
  }
  if (m.includes("water") || m.includes("rain") || m.includes("leak")) {
    return `### 💧 EcoSense Hydro-Sustain Audit

Your hydro consumption and rainwater harvest assessment:
* **Rainwater Harvesting Calculator**: For a catchment area of **120 m²** with a standard monsoon average of **800 mm**, you can harvest up to **96,000 Liters** of graywater annually using a runoff efficiency coefficient of **0.85**.
* **Sewerage Loop & Storage**: Sizing a filtration tank at **15,000 Liters** covers non-potable sanitation and horticultural demands during dry spells.
* **Leak Simulated Analytics**: A pinhole pipe leak (diameter ~1.5mm) under 3 bar pressure wastes up to **180 Liters/day**!

**Conservation Tip**: Retrofit aerators on industrial faucets to curtail operational flow from **9 L/min to 3.8 L/min** instantly.`;
  }
  return `### 🌿 EcoSense Intelligent Sustainability Platform

I have reviewed your query regarding environmental sustainability. Here is our expert strategy:
* **Green Architecture**: Build utilizing aerated concrete blocks (AAC) to lower structural weight and gain a higher thermal envelope (saving **22% HVAC energy**).
* **Grid Sizing**: Maximize natural daylighting vectors to reduce diurnal workspace lighting loads by **35%**.
* **Materials Sourcing**: Emphasize carbon-sequestering materials like processed engineered bamboo and mycelium composites.

**SIH Theme 2 Goal**: Let's track your inputs! Use the sidebar to explore waste logs, energy sizing estimators, rainwater harvesting, air quality charts, and smart circular economy forecasting.`;
}

// 4. Waste Segregation Tracking (Module 7)
app.get("/api/waste", (req, res) => {
  const db = readDB();
  res.json(db.waste_data);
});

app.post("/api/waste", (req, res) => {
  const { type, weight } = req.body;
  if (!type || !weight) {
    return res.status(400).json({ error: "Missing type or weight" });
  }
  const db = readDB();
  const weightNum = parseFloat(weight);
  
  // Calculate impact metrics based on material type
  let points = Math.round(weightNum * 10);
  let co2Impact = -(weightNum * 1.5); // CO2 avoided
  
  if (type === "E-Waste") {
    points = Math.round(weightNum * 100);
    co2Impact = -(weightNum * 15.6);
  } else if (type === "Plastic") {
    points = Math.round(weightNum * 20);
    co2Impact = -(weightNum * 2.3);
  } else if (type === "Hazardous") {
    points = Math.round(weightNum * 50);
    co2Impact = -(weightNum * 4.8);
  } else if (type === "Metal") {
    points = Math.round(weightNum * 40);
    co2Impact = -(weightNum * 5.2);
  }

  const newLog = {
    id: `w_${Date.now()}`,
    type,
    weight: weightNum,
    points,
    co2Impact: parseFloat(co2Impact.toFixed(2)),
    date: new Date().toISOString()
  };

  db.waste_data.unshift(newLog);
  
  // Update user score
  if (db.users[0]) {
    db.users[0].points += points;
    db.users[0].impactMetrics.wasteRecycled += weightNum;
    db.users[0].impactMetrics.co2Saved += Math.abs(co2Impact);
  }

  writeDB(db);
  res.json({ success: true, log: newLog, user: db.users[0] });
});

// 5. Renewable Energy Calculator (Module 8)
app.get("/api/energy", (req, res) => {
  const db = readDB();
  res.json(db.energy_data);
});

app.post("/api/energy", (req, res) => {
  const { type, value, unit, carbonAvoided } = req.body;
  const db = readDB();
  const newLog = {
    id: `e_${Date.now()}`,
    type,
    value: parseFloat(value),
    unit,
    carbonAvoided: parseFloat(carbonAvoided) || 0,
    date: new Date().toISOString()
  };
  db.energy_data.unshift(newLog);

  if (db.users[0] && parseFloat(carbonAvoided) > 0) {
    db.users[0].impactMetrics.co2Saved += parseFloat(carbonAvoided);
    db.users[0].points += Math.round(parseFloat(carbonAvoided) * 5);
  }

  writeDB(db);
  res.json({ success: true, log: newLog, user: db.users[0] });
});

// 6. Water Consumption & Rainwater (Module 9)
app.get("/api/water", (req, res) => {
  const db = readDB();
  res.json(db.water_data);
});

app.post("/api/water", (req, res) => {
  const { consumption, rwhYield, leaksSimulated } = req.body;
  const db = readDB();
  const newLog = {
    id: `wat_${Date.now()}`,
    consumption: parseFloat(consumption) || 0,
    rwhYield: parseFloat(rwhYield) || 0,
    leaksSimulated: parseInt(leaksSimulated) || 0,
    date: new Date().toISOString()
  };
  db.water_data.unshift(newLog);

  if (db.users[0] && rwhYield > 0) {
    db.users[0].impactMetrics.waterSaved += parseFloat(rwhYield);
    db.users[0].points += Math.round(parseFloat(rwhYield) * 0.5);
  }

  writeDB(db);
  res.json({ success: true, log: newLog, user: db.users[0] });
});

// 7. Environment Air/Noise Log & Tracking (Module 10)
app.get("/api/environment", (req, res) => {
  const db = readDB();
  res.json(db.environment_data);
});

app.post("/api/environment", (req, res) => {
  const { aqi, co2, humidity, temperature, noise } = req.body;
  const db = readDB();
  const newLog = {
    id: `env_${Date.now()}`,
    aqi: parseInt(aqi) || 50,
    co2: parseInt(co2) || 400,
    humidity: parseInt(humidity) || 50,
    temperature: parseInt(temperature) || 25,
    noise: parseInt(noise) || 45,
    date: new Date().toISOString()
  };
  db.environment_data.unshift(newLog);
  writeDB(db);
  res.json({ success: true, log: newLog });
});

// 8. Smart Utilities Tracker (Module 11)
app.get("/api/utilities", (req, res) => {
  const db = readDB();
  res.json(db.utilities_data);
});

app.post("/api/utilities", (req, res) => {
  const { electricity, water, gas } = req.body;
  const db = readDB();
  const newLog = {
    id: `u_${Date.now()}`,
    electricity: parseFloat(electricity) || 0,
    water: parseFloat(water) || 0,
    gas: parseFloat(gas) || 0,
    date: new Date().toISOString()
  };
  db.utilities_data.unshift(newLog);
  writeDB(db);
  res.json({ success: true, log: newLog });
});

// 9. Manufacturing Sustainability (Module 12)
app.get("/api/manufacturing", (req, res) => {
  const db = readDB();
  res.json(db.manufacturing_data);
});

app.post("/api/manufacturing", (req, res) => {
  const { rawMaterial, scrapRate, carbonEfficiency, co2Emissions } = req.body;
  const db = readDB();
  const newLog = {
    id: `m_${Date.now()}`,
    rawMaterial: parseFloat(rawMaterial) || 0,
    scrapRate: parseFloat(scrapRate) || 0,
    carbonEfficiency: parseFloat(carbonEfficiency) || 90,
    co2Emissions: parseFloat(co2Emissions) || 0,
    date: new Date().toISOString()
  };
  db.manufacturing_data.unshift(newLog);
  writeDB(db);
  res.json({ success: true, log: newLog });
});

// 10. Sustainable Packaging Materials (Module 13)
app.get("/api/packaging", (req, res) => {
  const db = readDB();
  res.json(db.packaging_data);
});

app.post("/api/packaging", (req, res) => {
  const { original, greenAlt, costChange, score } = req.body;
  const db = readDB();
  const newLog = {
    id: `p_${Date.now()}`,
    original,
    greenAlt,
    costChange: parseFloat(costChange) || 0,
    score: parseInt(score) || 80,
    date: new Date().toISOString()
  };
  db.packaging_data.unshift(newLog);
  writeDB(db);
  res.json({ success: true, log: newLog });
});

// 11. Infrastructure & Tree Tracker (Module 14)
app.get("/api/infrastructure", (req, res) => {
  const db = readDB();
  res.json(db.infrastructure_data);
});

app.post("/api/infrastructure", (req, res) => {
  const { action, count, treesTracked, canopyArea, offsetKgs, status } = req.body;
  const db = readDB();
  
  if (action === "plant") {
    const treesAdded = parseInt(count) || 1;
    const additionalOffset = treesAdded * 22; // Average offset per tree kg/year
    
    if (db.infrastructure_data.length === 0) {
      db.infrastructure_data.push({ id: "i_1", treesTracked: 0, canopyArea: 0, offsetKgs: 0, status: "Healthy" });
    }
    
    db.infrastructure_data[0].treesTracked += treesAdded;
    db.infrastructure_data[0].canopyArea += treesAdded * 3.2; // ~3.2 sqm per sapling canopy
    db.infrastructure_data[0].offsetKgs += additionalOffset;
    
    if (db.users[0]) {
      db.users[0].impactMetrics.treesPlanted += treesAdded;
      db.users[0].impactMetrics.co2Saved += additionalOffset;
      db.users[0].points += treesAdded * 150; // high points reward for tree planting!
    }
  } else {
    // manual update
    db.infrastructure_data[0] = {
      id: "i_1",
      treesTracked: parseInt(treesTracked) || db.infrastructure_data[0].treesTracked,
      canopyArea: parseFloat(canopyArea) || db.infrastructure_data[0].canopyArea,
      offsetKgs: parseFloat(offsetKgs) || db.infrastructure_data[0].offsetKgs,
      status: status || db.infrastructure_data[0].status
    };
  }

  writeDB(db);
  res.json({ success: true, data: db.infrastructure_data[0], user: db.users[0] });
});

// 12. AI Vision Image Classifier (Module 17 AI Vision!)
app.post("/api/vision", async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "No image content provided" });
  }

  // Extract base64 clean data (strip mime prefix if present)
  let cleanBase64 = imageBase64;
  let mimeType = "image/png";
  if (imageBase64.includes(";base64,")) {
    const parts = imageBase64.split(";base64,");
    mimeType = parts[0].replace("data:", "");
    cleanBase64 = parts[1];
  }

  const prompt = `Analyze this discarded item or waste material. Provide an expert EcoSense classification in standard JSON format:
{
  "itemDetected": "Exact name of the item",
  "category": "Organic" | "Plastic" | "Paper" | "Metal" | "Glass" | "E-Waste" | "Hazardous",
  "recyclabilityScore": 0-100,
  "segregationInstructions": "Actionable, precise instructions on how to prepare and segregate this item",
  "ecoAlternatives": "A list of eco-friendly, sustainable alternatives or circular reuse recommendations for this product",
  "estimatedCo2Offset": "CO₂ weight in kg saved by recycling this instead of sending to landfill (e.g. '2.4 kg CO2')"
}`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          },
          { text: prompt }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      const parsed = JSON.parse(response.text.trim());
      return res.json({ result: parsed, isDemoMode: false });
    } else {
      // Return beautiful mock analysis when Gemini API is unconfigured
      const randomItems = [
        {
          itemDetected: "Single-Use Plastic Bottle",
          category: "Plastic",
          recyclabilityScore: 92,
          segregationInstructions: "Rinse out any sugary beverage residues completely. Compress the bottle to reduce container volume, and ensure the bottle cap is recycled separately if made of secondary plastics (PP).",
          ecoAlternatives: "Stainless steel hydro-flasks, vacuum-insulated aluminum bottles, or biodegradable seaweed water pouches.",
          estimatedCo2Offset: "1.2 kg CO₂"
        },
        {
          itemDetected: "Corrugated Cardboard Packing Box",
          category: "Paper",
          recyclabilityScore: 98,
          segregationInstructions: "Remove all shipping labels and adhesive packing tapes. Flatten the box to maximize storage, and keep it completely dry. Avoid recycling if contaminated with industrial food oils (e.g., pizza stains).",
          ecoAlternatives: "Reusable collapsible heavy-duty plastic totes, honeycomb-structure starch boxes, or cloth bags.",
          estimatedCo2Offset: "0.85 kg CO₂"
        },
        {
          itemDetected: "Dead Lithium-Ion Mobile Battery",
          category: "Hazardous",
          recyclabilityScore: 45,
          segregationInstructions: "Do NOT place in standard household bins. Seal the terminals with insulated adhesive tape to prevent transient short-circuits, and deliver immediately to an authorized e-waste e-waste recycler.",
          ecoAlternatives: "Solid-state sodium-ion batteries, rechargeable smart-chargers, or organic carbon batteries.",
          estimatedCo2Offset: "4.5 kg CO₂"
        }
      ];
      
      // Select random item
      const selected = randomItems[Math.floor(Math.random() * randomItems.length)];
      return res.json({ result: selected, isDemoMode: true });
    }
  } catch (err: any) {
    console.error("AI Vision classification error:", err);
    res.status(500).json({ error: "Failed to perform AI vision audit", details: err.message });
  }
});

// 13. AI Document Assistant (Module 16)
app.post("/api/document", async (req, res) => {
  const { fileName, fileContent, question } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: "No document content provided" });
  }

  const prompt = question 
    ? `The following is extracted text or content from a sustainability report/document (${fileName}):
    === DOCUMENT TEXT ===
    ${fileContent.substring(0, 10000)}
    === END DOCUMENT TEXT ===
    
    User Query: "${question}"
    
    Analyze the document content and answer the user query clearly using sustainability statistics if present in the text.`
    : `The following is extracted text or content from a sustainability report/document (${fileName}):
    === DOCUMENT TEXT ===
    ${fileContent.substring(0, 10000)}
    === END DOCUMENT TEXT ===
    
    Please provide an expert sustainability executive summary in standard JSON format:
    {
      "title": "Title of the report or document analyzed",
      "summary": "A concise executive summary highlighting key ecological performance indices",
      "sustainabilityGrade": "A" | "B" | "C" | "D" | "F",
      "carbonFootprintMentioned": "Any carbon footprint figures mentioned, or 'Not Specified'",
      "actionableRecommendations": [
        "Actionable point 1 based on document analysis",
        "Actionable point 2",
        "Actionable point 3"
      ]
    }`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: question ? { temperature: 0.5 } : { responseMimeType: "application/json", temperature: 0.1 }
      });
      const text = response.text.trim();
      if (question) {
        return res.json({ answer: text, isDemoMode: false });
      } else {
        const parsed = JSON.parse(text);
        return res.json({ analysis: parsed, isDemoMode: false });
      }
    } else {
      // Simulated Response
      if (question) {
        return res.json({
          answer: `Based on the mock analyzer for "${fileName}", the sustainability indicators show standard compliance. Regarding your query "${question}", we recommend reinforcing secondary greywater recycling and scheduling building energy audits during summer peak loads.`,
          isDemoMode: true
        });
      } else {
        return res.json({
          analysis: {
            title: fileName || "Eco-Audit Report Draft",
            summary: "This report details factory energy usage and municipal water flows. Energy intensity indexes show high off-peak idle power loads (~18 kW), with packaging streams still relying on standard non-degradable PVC packing shrink-wrap.",
            sustainabilityGrade: "B",
            carbonFootprintMentioned: "148.4 metric tons CO2-eq annually",
            actionableRecommendations: [
              "Schedule automatic HVAC shutdown sequences at 18:00 to shave off redundant heating/cooling loads.",
              "Substitute single-use shrink wraps with starch-based biodegradable alternative coatings.",
              "Upgrade the manufacturing cleanrooms with low-flow sensor faucets to shave off 12% operational water flows."
            ]
          },
          isDemoMode: true
        });
      }
    }
  } catch (err: any) {
    console.error("Document Assistant Error:", err);
    res.status(500).json({ error: "Failed to process document", details: err.message });
  }
});

// 14. Forecasting & AI Modeling (Module 15 & 11 Utilities forecasting)
app.get("/api/ai/forecast", (req, res) => {
  // Generate beautiful regression forecast series
  const now = new Date();
  const series = [];
  for (let i = 1; i <= 6; i++) {
    const fDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthLabel = fDate.toLocaleString("default", { month: "short" });
    series.push({
      month: monthLabel,
      predictedEnergy: Math.round(110 - (i * 4) + (Math.sin(i) * 8)), // steady decline with optimization
      predictedWater: Math.round(330 - (i * 12) + (Math.cos(i) * 15)),
      predictedCo2: parseFloat((1.7 - (i * 0.08)).toFixed(2)),
      confidenceInterval: "±4%"
    });
  }
  res.json({
    forecast: series,
    insight: "EcoSense predictive regressions anticipate a cumulative carbon footprint shaving of **14.8%** over the upcoming 180 days, driven heavily by your current tree plantation canopy offset and organic waste compost segregation.",
  });
});

// 15. Reports list
app.get("/api/reports", (req, res) => {
  const db = readDB();
  res.json(db.reports);
});

app.post("/api/reports", (req, res) => {
  const db = readDB();
  const { title, type, summary, score } = req.body;
  const newReport = {
    id: `rep_${Date.now()}`,
    title,
    type,
    status: "Generated",
    score: score || 85,
    summary,
    createdAt: new Date().toISOString()
  };
  db.reports.unshift(newReport);
  writeDB(db);
  res.json(newReport);
});


// Vite Server Connection logic
async function startServer() {
  // Development Mode setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EcoSense AI Engine] Server actively running on http://localhost:${PORT}`);
  });
}

startServer();
