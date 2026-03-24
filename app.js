require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const systemPrompt = require('./systemPrompt');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ['https://portfolio-mayank-gamma.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Helper function to handle SSE streaming responses from various AI providers
const handleStreamingResponse = (response, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let buffer = '';

    response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep the last partial line in the buffer

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
                const data = trimmedLine.slice(6);
                if (data === '[DONE]') {
                    res.write('data: [DONE]\n\n');
                    return res.end();
                }
                try {
                    const parsed = JSON.parse(data);
                    const content = (parsed.choices?.[0]?.delta?.content) || '';
                    if (content) {
                        res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    }
                } catch (e) {
                    // Ignore non-JSON lines
                }
            }
        }
    });

    response.data.on('end', () => {
        if (buffer && buffer.trim().startsWith('data: ')) {
            // Process any remaining data in the buffer
            const data = buffer.trim().slice(6);
            if (data !== '[DONE]') {
                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
                } catch (e) {}
            }
        }
        res.end();
    });

    response.data.on('error', (err) => {
        console.error('Streaming error:', err);
        res.end();
    });
};

app.get('/', (req, res) => res.send('Hello World!'));

// Main Chat Route (Currently using Sarvam AI for the frontend)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
        const response = await axios.post(
            'https://api.sarvam.ai/v1/chat/completions',
            {
                model: 'sarvam-30b', // Updated model as requested
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
                stream: true
            },
            {
                headers: { 'Authorization': `Bearer ${SARVAM_API_KEY}`, 'Content-Type': 'application/json' },
                responseType: 'stream'
            }
        );

        handleStreamingResponse(response, res);
    } catch (error) {
        console.error('Sarvam AI Error:', error.message);
        res.write(`data: ${JSON.stringify({ error: 'Failed to get response from Sarvam AI' })}\n\n`);
        res.end();
    }
});

// Alternative Route for OpenRouter
app.post('/api/openrouter-chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

        const API_KEY = process.env.OPENROUTER_API_KEY;
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'arcee-ai/trinity-mini:free',
                messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
                stream: true
            },
            {
                headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
                responseType: 'stream'
            }
        );

        handleStreamingResponse(response, res);
    } catch (error) {
        console.error('OpenRouter Error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to get response from OpenRouter' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
