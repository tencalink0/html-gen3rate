import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

function convertToWrapper(text: string): [string, string] | Error {
    let lines = text.split(/\r?\n/);
    const splitPos = parseInt(lines[0]); // splits after line "n"
    if (Number.isNaN(splitPos)) return new Error('Failed to parse wrapper');

    lines = lines.slice(1);
    if (splitPos > lines.length || splitPos < 0) return new Error('Failed to parse wrapper');
    return [
        lines.slice(0, splitPos-1).join('\n'),
        lines.slice(splitPos-1).join('\n'),
    ];
}

async function readPromptWrapper(title: string): Promise<[string, string]> {
    return new Promise((resolve, reject) => {
        fs.readFile(`./prompt_wrappers/${title}.txt`, 'utf-8', (err, data) => {
            if (err) {
                reject(new Error('Failed to extract wrapper'));
            } else {
                const errWrapper = convertToWrapper(data);
                if (errWrapper instanceof Error) {
                    reject(new Error('Failed to extract wrapper')); 
                } else {
                    resolve(errWrapper);
                }
            }
        });
    });
}

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/test", async (_req, res) => {
    let wrapper: [string, string] | undefined = undefined;
    try {
        const localWrapper = await readPromptWrapper('html');
        wrapper = localWrapper;
    } catch (err: any) {
        res.status(500).json({ error: err.message ?? String(err) });
    }

    if (wrapper !== undefined) res.json({
        "wrapper-top": wrapper[0],
        "wrapper-bottom": wrapper[1]
    });
});

app.post("/api/chatbot", async (req, res) => { 
    try {
        const userMessages = req.body.messages
            .map((message: any) => {
                if (!message.role || !message.content) return message;
                if (
                    message.role === 'assistant' && message.content.html
                ) {
                    return {
                        ...message,
                        content: message.content.html
                    };
                } else {
                    return message;
                }
            })
            .filter((message: any) => {
                return message.content && message.content.trim() !== ""
        });

        //console.log(userMessages);

        if (!userMessages || userMessages.length < 0) {
            res.status(400).json({ error: "Missing messages array in body" });
            return;
        }

        let wrapper: [string, string] | undefined = undefined;
        try {
            const localWrapper = await readPromptWrapper('html');
            wrapper = localWrapper;
        } catch (err: any) {
            res.status(500).json({ error: err.message ?? String(err) });
        }

        if (wrapper !== undefined) {
            const wrappedLastMessage = [
                ...userMessages.slice(0, -1),
                {
                    role: 'user',
                    content: wrapper[0] + ' ' + userMessages[userMessages.length-1].content + ' \n' + wrapper[1]
                }
            ];

            const response = await fetch("https://ai.hackclub.com/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: wrappedLastMessage })
            });

            const data = await response.json();
            res.json(data);
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error });
    }
});

app.get(/^.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});