import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chatbot", async (req, res) => { 
    try {
        const userMessages = req.body.messages;

        if (!userMessages) {
            res.status(400).json({ error: "Missing messages array in body" });
            return;;
        }

        const response = await fetch("https://ai.hackclub.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: userMessages })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error forwarding to Hack Club AI:", error);
        res.status(500).json({ error: "Failed to get response from AI" });
    }
});

app.get(/^.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});