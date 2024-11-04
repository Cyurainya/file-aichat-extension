import express from 'express';
import OpenAI from "openai";
import bodyParser from 'body-parser';

const app = express();
// @ts-ignore
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: "sk-hiti7mktsEaqQ04sKvS7ksX7t9lQOg0cAkTjk9o33jLf84fM",
  baseURL: "https://api.moonshot.cn/v1",
});


// 设置跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post('/api/chat/completions', async (req, res) => {
  try {
    const messages = req.body.message;
    console.log(messages)
    if (!messages) {
      return res.status(400).json({ error: 'Message parameter is required' });
    }
    const stream = await client.chat.completions.create({
      model: "moonshot-v1-8k",
      messages,
      temperature: 0.3,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of stream) {
      const delta = chunk.choices[0].delta;
      if (delta.content) {
        res.write(delta.content);
      }
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});