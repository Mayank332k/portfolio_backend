require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/',(req , res) => {
    res.send('Hello World!');
})


app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        const API_KEY = process.env.OPENROUTER_API_KEY;
        const systemPrompt = require('./systemPrompt');

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'stepfun/step-3.5-flash:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                stream: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'stream'
            }
        );

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        res.write('data: [DONE]\n\n');
                        return res.end();
                    }
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || '';
                        if (content) {
                            res.write(`data: ${JSON.stringify({ content })}\n\n`);
                        }
                    } catch (e) {}
                }
            }
        });

        response.data.on('end', () => {
            res.end();
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
